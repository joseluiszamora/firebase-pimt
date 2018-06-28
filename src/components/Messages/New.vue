<template lang="pug">
  v-card(color='white')
    v-card-text Nuevo
    form
      v-layout(row, wrap)
        v-text-field(label='Titulo', v-model='tituloForm', required)
      v-layout(row, wrap)
        v-text-field(label='Mensaje', v-model='descripcionDeObra')
      v-layout(row, justify-center)
        v-flex.xs6
          v-btn(dark, color='deep-orange', @click='closeForm')
            | Cancelar 
            v-icon clear
          v-btn(dark, color='orange', @click='clear')
            v-icon refresh
        v-flex.xs2
          v-btn(dark, color='green', @click='sendMessage2')
            | Guardar 
            v-icon save

</template>

<script>
  import http from '@/http/firebase'
  var admin = require('firebase-admin')
  var serviceAccount = require('../../config/pimt-mt-firebase-adminsdk.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pimt-mt.firebaseio.com"
  })
  /* admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pimt-mt.firebaseio.com"
  })
  admin.initializeApp({
    credential: admin.credential.refreshToken('../../config/pimt-mt-firebase-adminsdk.json'),
    databaseURL: "https://pimt-mt.firebaseio.com"
  }) */

  export default {
    data () {
      return {
        tituloForm: '',
        descripcionDeObra: ''
      }
    },
    methods: {
      closeForm () {
      },
      clear () {
      }, 
      submit () {
        http.sendMessage().then(res => {
          console.log(res)
        }, (error) => {
          this.showError = true
          console.log(error)
        })
      },
      getToken () {
        return new Promise(function(resolve, reject) {
          var key = require('../../config/pimt-mt-firebase-adminsdk.json');
          var jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            SCOPES,
            null
          );
          jwtClient.authorize(function(err, tokens) {
            if (err) {
              reject(err);
              return;
            }
            resolve(tokens.access_token);
          });
        });
      },
      sendMessage () {
        // This registration token comes from the client FCM SDKs.
        var registrationToken = 'emEbMgxCNs8:APA91bHEPWs9DlFe6__ZlspbRZqoOKF4aFbnFs-UUd3z4kiAzq1Sg1gQYgOrEMJ8bApIlgS4_UlqcOZknDA_6i5QbLrxnYESRW255NEl4xUy6je1ilZmx67kPHVkzP3W5yyNIxiuSx-vEmwDKzeqnRjkk8BB6QcGGA'
        // See documentation on defining a message payload.
        var message = {
          data: {
            score: '850',
            time: '2:45'
          },
          token: registrationToken
        }
        // Send a message to the device corresponding to the provided
        // registration token.
        admin.messaging().send(message)
        .then((response) => {
          // Response is a message ID string.
          console.log('Successfully sent message:', response)
        })
        .catch((error) => {
          console.log('Error sending message:', error)
        });
      },
      sendMessage2 () {
        console.log('Message 2')
        var payload = {
          notification: {
            title: "This is a Notification",
            body: "This is the body of the notification message."
          }
        }
        var registrationToken = 'emEbMgxCNs8:APA91bHEPWs9DlFe6__ZlspbRZqoOKF4aFbnFs-UUd3z4kiAzq1Sg1gQYgOrEMJ8bApIlgS4_UlqcOZknDA_6i5QbLrxnYESRW255NEl4xUy6je1ilZmx67kPHVkzP3W5yyNIxiuSx-vEmwDKzeqnRjkk8BB6QcGGA'

        admin.messaging().sendToDevice(registrationToken, payload)
        .then(function(response) {
          console.log("Successfully sent message:", response)
        })
        .catch(function(error) {
          console.log("Error sending message:", error)
        })
      }
    }
  }
</script>
