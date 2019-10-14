import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, MenuController, Platform, Slides, PopoverController, AlertController, NavParams, LoadingController } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { BuilderProfileviewPage } from '../builder-profileview/builder-profileview';
import * as firebase from 'firebase';
import { CallNumber } from '@ionic-native/call-number';
import { ProfileComponent } from '../../components/profile/profile';
import { ViewmessagePage } from '../viewmessage/viewmessage';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
declare var google;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('slides') slides: Slides;
  @ViewChild("map") mapElement: ElementRef;

  map: any;
  //input: any;
  db = firebase.firestore().collection('Users');
  dbRequest = firebase.firestore().collection('Request');
  items: any;
  info = false;
  builder = [];
  owner = [];
  status: string = '';
  maps: boolean = false;
  request: boolean = false;

  ownerUID: string;
  ownerName;
  ownerImage: any;
  bUID: string;
  price = 0;
  /* Search variables */
  location = false;
  name = false;
  range = false;
  header = 'value';
  uid = firebase.auth().currentUser.uid;
  /* Search variebles */
  homeowner = false;
  message = '';
  isBuilder;
  input = '';
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
  geoData = {
    lat: 0,
    lng: 0
  }
  total: number;
  constructor(public navCtrl: NavController,
    public geolocation: Geolocation,
    public navParams: NavParams,
    public platform: Platform,
    public popoverCtrl: PopoverController,
    public elementref: ElementRef,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController) {

  }

  RangeSearch() {
    this.range = !this.range;
  }

  ionViewDidLoad() {
    this.db.doc(this.uid).onSnapshot((res) => {
      if (res.data().builder == false) {
        //this.loadCtrl();
        //document.getElementById('header').style.display = "none";
        this.loadMap();
        this.getPosition();

      }
      if (res.data().builder == true) {
        this.getRequests();

      }
    })

    // console.log(this.navParams.data);

    // this.getRequests();
    // this.loadMap();
    this.isBuilder = firebase.auth().currentUser.uid;
    console.log('check if the user is a builder: ', this.isBuilder);
    // if (this.authService.manageUsers() == true) {
    //   this.getUser = "Home Builder";
    // } else {
    //   this.getUser = "Aspiring Home Owner"

    // }
  }

  moveMapEvent() {
    let currentIndex = this.slides.getActiveIndex();
    let currentEvent = this.builder[currentIndex];
    // this.map.setCenter({ lat: currentEvent.lat, lng: currentEvent.lng })
    this.loadCtrl();
    this.geolocation.getCurrentPosition().then((resp) => {
      let geoData = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      }

      let start = new google.maps.LatLng(geoData.lat, geoData.lng); 
      let end = new google.maps.LatLng(currentEvent.lat, currentEvent.lng)
      const that = this;
      this.directionsService.route({
        origin: start,
        destination: end,
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.METRIC,
       // icon: 'https://img.icons8.com/color/24/000000/worker-male--v2.png'
      },
        (response, status) => {
          if (status === 'OK') {
            that.directionsDisplay.setDirections(response);
            this.total = 0;
            let myroute = response.routes[0];
            for (let i = 0; i < myroute.legs.length; i++) {
              this.total += myroute.legs[i].distance.value;
            }
            this.total = this.total / 1000;
            //console.log(this.total);
            
          }
          else {
            const alert = this.alertCtrl.create({
              title: 'Address not found',
              subTitle: 'This builder does not have the address',
              buttons: ['OK']
            });
            alert.present();
            // console.log('address not found.................');
          }
        });
    })
  }

  getPosition(): any {
    this.geolocation.getCurrentPosition().then(resp => {
      this.setMapCenter(resp);

    })
  }
  loadCtrl() {
    this.loadingCtrl.create({
      content: 'Please wait..',
      duration: 2000
    }).present()
  }
  getBuilders() {
    this.db.where('builder', '==', true).onSnapshot((res) => {
      this.builder = [];
      
      res.forEach((doc) => {
        if (doc.data().address) {
          // this.errorMessage('User found',doc.id)
          this.builder.push(doc.data());
          // console.log(this.builder);
          let myLatLng = new google.maps.LatLng(doc.data().lat, doc.data().lng)
          let marker = new google.maps.Marker({
            position: myLatLng,
            map: this.map,
            title: 'Hello World!',
            icon: "https://img.icons8.com/color/40/000000/worker-male--v2.png"
          });
          google.maps.event.addListener(marker, 'click', (resp) => {
            this.viewBuilderInfo(doc.data());
          })
        }

      })
    })
  }
  errorMessage(errCode, errMsg) {
    const alert = this.alertCtrl.create({
      title: errCode,
      subTitle: errMsg,
      buttons: ['OK']
    });
    alert.present();
  }
  loadMap() {

    this.input = 'Message of the input search show';
    this.header = '';
    let SA_BOUNDS = {
      north: -22.0913127581,
      south: -34.8191663551,
      west: 13.830120477,
      east: 32.830120477,
    };
    let latlng = new google.maps.LatLng(26.2708, 28.1123);
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: latlng,
      restriction: {
        latLngBounds: SA_BOUNDS,
        strictBounds: true,
      },
      zoom: 15,
      disableDefaultUI: true,
      styles: [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f5f5"
            }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f5f5"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#bdbdbd"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#eeeeee"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e5e5e5"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ffffff"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dadada"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e5e5e5"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#eeeeee"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#c9c9c9"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        }
      ]
    });
    this.getBuilders();


    setTimeout(() => {
      let input = document.getElementsByClassName('pac-input')

      // console.log('search input',input[0])


      let searchBox = new google.maps.places.SearchBox(input[0]);
      //this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input[0]);
      // Bias the SearchBox results towards current map's viewport.
      this.map.addListener('SA_BOUNDS', (res) => {
        searchBox.setBounds(this.map.getBounds());
      });
      let markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener('places_changed', (res) => {
        let places = searchBox.getPlaces();
        if (places.length == 0) {
          return;
        }
        // Clear out the old markers.
        markers.forEach((marker) => {
          marker.setMap(null);
        });
        markers = [];
        // For each place, get the icon, name and location.
        let bounds = new google.maps.LatLngBounds();
        places.forEach((place) => {
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }
          let icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };
          // Create a marker for each place.
          markers.push(new google.maps.Marker({
            map: this.map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }));
          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        this.map.fitBounds(bounds);
      });
    }, 1000);
    this.directionsDisplay.setMap(this.map)
    // this.directionsDisplay.setPanel(document.getElementById('right-panel'));
  }

  setMapCenter(position: Geoposition) {
    let myLatLng = { lat: position.coords.latitude, lng: position.coords.longitude };
    this.map.setCenter(myLatLng);

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      let marker = new google.maps.Marker({
        position: myLatLng,
        map: this.map,
        icon: 'https://img.icons8.com/nolan/40/000000/user-location.png'
        //  title: 'Hello World!'
      });
      //  this.map.classList.add('map');
    });
  }

  search(event) {
    let searchKey: string = event;
    // let firstLetter = searchKey;
    // this.builder = [];
    // this.db.where('fullName', '==', firstLetter)
    //   .where('builder', '==', true)
    //   .onSnapshot((res) => {
    //     if (res.size > 0) {
    //       this.builder = [];
    //       res.forEach((doc) => {
    //         this.builder.push(doc.data());
    //       })
    //     } else {
    //       //  console.log(this.builder);
    //       this.builder = [];
    //       this.db.where("builder", "==", true).onSnapshot(snapshot => {
    //         snapshot.forEach(doc => {
    //           this.builder.push(doc.data());
    //           this.bUID = doc.id;
    //         });
    //         //console.log('Builders: ', this.builder);
    //       });
    //     }
    //   })
  }
  setPriceRange(param) {
    this.price = param;
    // console.log("Price range = "+ this.price);
    if (this.price >= 0) {
      this.builder = [];
      this.db.where('price', '>=', param)
        .onSnapshot((res) => {
          // console.log(res.);
          res.forEach((doc) => {
            // this.db.collection('builderProfile').get().then(snapshot => {
            //   snapshot.forEach(doc => {
            this.builder.push(doc.data());
            this.bUID = doc.id;
            //   });
            //   console.log('Builders: ', this.builder);
            // });
          })
        })
    }
  }
  viewProfile(myEvent) {
    let popover = this.popoverCtrl.create(ProfileComponent, { image: myEvent });
    popover.present({
      ev: myEvent
    });
  }
  viewHouse(myEvent) {
    console.log('image', myEvent);
    let popover = this.popoverCtrl.create(ProfileComponent, { image: myEvent });
    popover.present({
      ev: myEvent
    });
  }
  // callJoint(phoneNumber) {
  //   this.callNumber.callNumber(phoneNumber, true);
  // }
  //viewmore
  viewBuilderInfo(builder) {
    this.navCtrl.push(BuilderProfileviewPage, builder);
  }
  viewRequest(user) {
    this.navCtrl.push(ViewmessagePage, user);
    //console.log(user);

  }

  getRequests() {
    // this.request = true;
    let data = {
      builder: {},
      owner: {}
    }

    //  document.getElementById('map').style.display = "block";
    this.builder = [];
    this.dbRequest.where('builderUID', '==', firebase.auth().currentUser.uid).onSnapshot((res) => {
      this.owner = [];
      document.getElementById('req').style.display = "flex";
      document.getElementById('map').style.display = "none";
      res.forEach((doc) => {
        this.db.doc(doc.data().hOwnerUid).get().then((res) => {
          data.owner = res.data();
          data.builder = doc.data();
          this.owner.push(data);
          console.log(this.owner);
          data = {
            builder: {},
            owner: {}
          }
        })
      })
    })
  }

  // showmap(){
  //   document.getElementById('hidemap').style.display = "flex"

  // }
}



