import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

const db = admin.firestore();

import * as sgMail from '@sendgrid/mail';

const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);

export const welcomeEmail = functions.auth.user().onCreate((user)=>{
    const msg = {
        to: user.email,
        from: 'hello@fireship.oi',
        templateId: TEMPLATE_ID,
        dynamic_template_data: {
            subject:'Welcome to us!',
            name:user.displayName
        },
    };

    return sgMail.send(msg)
})


export const genericEmail = functions.https.onCall(async (data, context)=>{
    if(!context.auth || !context.auth.token.email){
        throw new functions.https.HttpsError('failed-precondition', 'Must be logged with an email address');
    }

    const msg = {
        to: context.auth.token.email,
        from: 'hello@fireship.oi',
        templateId: TEMPLATE_ID,
        dynamic_template_data: {
            subject: data.subject,
            name:data.text
        },
    };
    await sgMail.send(msg);


    return {
        success: true
    };
})

export const newComment = functions.firestore.document('posts/{postId}/comments/{commentId}')
.onCreate(async (change, context)=>{
    const postSnap = await db.collection('posts').doc(context.params.postId).get();

    const post = postSnap.data() || {};
    const comment = change.data() || {};

    const msg = {
        to: post.authorEmail,
        from: 'hello@fireship.oi',
        templateId: TEMPLATE_ID,
        dynamic_template_data: {
            subject: `New Comment on ${post.title}`,
            name: post.displayName,
            text: `${comment.user} said... ${comment.text}`
        },
    };
    return sgMail.send(msg);
})
// const functions = require('firebase-functions');

// const admin = require('firebase-admin');

// admin.initializeApp(functions.config().firebase);

// const SENDGRID_API_KEY = functions.config().sendgrid.key
  
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(SENDGRID_API_KEY);

//export const helloWorld = functions.https.onRequest((request, response) => {
 

// exports.firestoreEmail = functions.firestore.document('builderProfile/{userId}/followers/{follwerId}')
// .onCreate((event) => {
//       const userId = event.id;
//      const db = admin.firestore();

//     return db.collection('users').doc(userId)
//     .get().then((doc)=>{
        // const user = doc.data();
     //   response.send('Njabulo Mlangeni');
        // const msg = {
        //     to: user.email,
        //     from: 'hello@angularfirebase.com',
        //     subject: 'New quotation',

        //     templateId: 'd-5954998c745e496cb86fdb64dec32dff',
        //     substitutionWrappers: ['{{','}}'],
        //     subsitutions: {
        //         name: user.displayName
        //     }
        // }
        // return sgMail.send(msg)
  //  })
//})

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
//})