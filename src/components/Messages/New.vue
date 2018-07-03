<template lang="pug">
  v-card(color='white')
    v-toolbar(color='primary', dark)
      v-toolbar-side-icon
      v-toolbar-title Nuevo Mensaje
      v-spacer
      v-btn(icon, @click.native="showAlive = !showAlive")
        v-icon visibility
    v-layout(row, wrap, pt-3)
      v-flex(:class='liveClass()')
        form.px-2
          v-layout(row, justify-center)
            v-flex.xs12
              v-text-field(label='Titulo', v-model='tituloForm', required)
          v-layout(row, justify-center)
            v-flex.xs12
              v-text-field(label='Mensaje', v-model='mensajeForm', multi-line)
          v-layout(row, wrap)
            v-flex(xs12)
              #drop(@drop='handleDrop', @click='handleDrop', @dragover='handleDragover', @dragenter='handleDragover') Click o Arrastre Aqui (jpg, png, jpeg)
                input(type='file', @change='onFileChange', multiple)
          v-layout(row, justify-center)
            v-flex.xs12
              v-btn(dark, color='deep-orange', @click='closeForm')
                | Cancelar 
                v-icon clear
              v-btn(dark, color='orange', @click='clear')
                v-icon refresh
              v-btn(dark, color='green', @click='sendMessage2')
                | Guardar 
                v-icon save
      v-flex.md6(v-if="showAlive")
        v-slide-y-transition(mode="out-in")
          v-card(color='white')
            v-card-text.display-1(style="text-align:center;") {{ tituloForm }}
            v-card-text {{ mensajeForm }}
            v-card(v-if="imageForm != null")
              v-card-media
                img(:src="imageForm", height="300")

  //v-flex.md12.pt-4
    v-card(color='white')
      v-card-text Entregar a :
        
</template>

<script>
  import http from '@/http/firebase'
  const functions = require('firebase-functions')
  const admin = require('firebase-admin')
  var serviceAccount = require('../../config/pimt-mt-firebase-adminsdk.json');

  admin.initializeApp(functions.config().firebase)
  /* admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pimt-mt.firebaseio.com"
  }) */

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
        tituloForm: 'Este es el titulo',
        mensajeForm: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras suscipit pulvinar ante, nec porttitor neque pulvinar vel. Phasellus nec elit eget eros luctus molestie. Donec nulla urna, euismod nec tortor id, ultricies viverra turpis. Integer ac enim vitae nisi congue vestibulum quis id tellus. Nunc id varius metus. Suspendisse a eros elementum, commodo eros sed, feugiat libero. Donec consectetur accumsan risus, et convallis magna. Duis euismod, erat ut laoreet consectetur, purus turpis vestibulum lorem, eu condimentum quam sem eget felis. Ut ac ornare eros. Curabitur purus dolor, vehicula id velit id, facilisis suscipit lorem. Sed vitae tincidunt diam. Suspendisse potenti. Proin dapibus arcu dignissim, scelerisque mauris eget, dapibus quam.',
        imageForm: null,
        showAlive: true,

      }
    },
    methods: {
      liveClass () {
        if (this.showAlive) {
          return 'md6'
        }
        return 'md12'
      },
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
      },
      handleDrop (e) { // arrastrar una imagen
        if (e.dataTransfer) {
          this.loading = true
          e.stopPropagation()
          e.preventDefault()
          var files = e.dataTransfer.files
          for (var i = 0; i < files.length; i++) {
            var f = files[i]
            var reader = new FileReader()
            let _this = this
            reader.onload = function (e) {
              var data = e.target.result
              _this.sendToList(data)
            }
            reader.readAsDataURL(f)
          }
        }
      },
      onFileChange (e) { // seleccionar una imagen
        this.loading = true
        var files = e.target.files || e.dataTransfer.files
        for (var i = 0; i < files.length; i++) {
          var f = files[i]
          var reader = new FileReader()
          let _this = this
          reader.onload = function (e) {
            var data = e.target.result
            _this.sendToList(data)
          }
          reader.readAsDataURL(f)
        }
      },
      handleDragover (e) {
        e.stopPropagation()
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
      },
      sendToList (base64) { // agregar un elemento a la lista
        this.imageForm = base64
      },
      removeElement (key) { // remover imagen de la lista
        let tempArray = []
        this.imagesRevision.forEach(function (element, index) {
          if (element.id !== key) { tempArray.push(element) }
        }, this)
        this.imagesRevision = tempArray
      },
      clear () {
        this.tituloForm = null
        this.mensajeForm = null
        this.imageForm = null
      }
    }
  }
</script>
<style scoped>
  #drop {
    border: 2px dashed #bbb;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    padding: 25px;
    text-align: center;
    font: 20pt bold, "Vollkorn";
    color: #bbb;
    position: relative;
  }
  #drop input {
    position: absolute;
    cursor: pointer;
    top: 0px;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
</style>
