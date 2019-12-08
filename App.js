const express = require('express');
const keys = require('./config/keys')
const stripe = require('stripe')(keys.stripeSecretKey);
const exphbs = require('express-handlebars');

const app = express();

// Body parser
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Handlebar middleware
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// Static Folder
app.use(express.static(`${__dirname}/public`))

app.get("/", (req, res) => {
    res.render('index', {
        stripePublishableKey: keys.stripePublishableKey
    });
});

app.post("/charge", (req, res) => {
    const amount = 2500;

    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    }).then(customer => stripe.charges.create({
        amount, 
        description: 'Web Development Ebook',
        currency: 'inr',
        customer: customer.id,
        shipping: {
            name: "Ridhav Modi",
            address: {
                line1: "Why",
                postal_code: '152116',
                city: "U cant gues",
                state: "Huejeu",
                country : "India"
            }
        }
    })).then(charge => res.render('success'));
})


const port = process.env.PORT || 5000;

app.listen(port, ()  => {
    console.log(`Server started on Port ${port}`);
})