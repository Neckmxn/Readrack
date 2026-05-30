const functions   = require('firebase-functions')
const admin       = require('firebase-admin')
const express     = require('express')
const cors        = require('cors')
const Stripe      = require('stripe')

admin.initializeApp()
const db = admin.firestore()

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
const app    = express()

app.use(cors({ origin: true }))

// ─── Create Stripe Checkout Session ───────────────────────────────────────────
app.post('/create-checkout-session', express.json(), async (req, res) => {
  try {
    const { bookId, bookTitle, price, userId, userEmail, successUrl, cancelUrl } = req.body

    if (!bookId || !price || !userId) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Verify book exists and price matches
    const bookSnap = await db.collection('books').doc(bookId).get()
    if (!bookSnap.exists) {
      return res.status(404).json({ error: 'Book not found' })
    }
    const book = bookSnap.data()
    if (book.isFree || book.price === 0) {
      return res.status(400).json({ error: 'This book is free' })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: userEmail,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name:        bookTitle || book.title,
            description: book.description || '',
            images:      book.coverUrl ? [book.coverUrl] : []
          },
          unit_amount: price
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: successUrl,
      cancel_url:  cancelUrl,
      metadata: { bookId, userId, bookTitle: book.title }
    })

    res.json({ sessionId: session.id })
  } catch (err) {
    console.error('Stripe error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ─── Stripe Webhook — fulfill order ───────────────────────────────────────────
app.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { bookId, userId, bookTitle } = session.metadata

    // Record purchase in Firestore
    await db.collection('purchases').add({
      bookId,
      userId,
      bookTitle,
      stripeSessionId: session.id,
      amount:          session.amount_total,
      customerEmail:   session.customer_email,
      status:          'completed',
      createdAt:       admin.firestore.FieldValue.serverTimestamp()
    })

    // Grant access: add bookId to user's purchased list
    const userRef = db.collection('users').doc(userId)
    await userRef.update({
      purchasedBooks: admin.firestore.FieldValue.arrayUnion(bookId)
    })

    console.log(`✅ Purchase recorded: ${bookTitle} by user ${userId}`)
  }

  res.json({ received: true })
})

// ─── Get user purchases ────────────────────────────────────────────────────────
app.get('/user-purchases/:userId', async (req, res) => {
  try {
    const snap = await db.collection('purchases')
      .where('userId', '==', req.params.userId)
      .orderBy('createdAt', 'desc')
      .get()
    const purchases = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    res.json({ purchases })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

exports.api = functions.https.onRequest(app)
