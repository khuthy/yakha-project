import { BaccountSetupPage } from './../baccount-setup/baccount-setup';
import { Component, ViewChild, ElementRef, OnInit, ViewChildren, Renderer2, QueryList } from '@angular/core';
import { NavController, ModalController, LoadingController, MenuController, Platform, Slides, PopoverController } from 'ionic-angular';
import * as firebase from 'firebase';
import { Geolocation } from '@ionic-native/geolocation';
import { BuilderProfileviewPage } from '../builder-profileview/builder-profileview';
import { WelcomePage } from '../welcome/welcome';
import { ViewmessagePage } from '../viewmessage/viewmessage';
import { CallNumber } from '@ionic-native/call-number';
import { LoginPage } from '../login/login';
import { ProfileComponent } from '../../components/profile/profile';
import { LocalNotifications } from '@ionic-native/local-notifications';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  // brightness: number = 20;
  // contrast: number = 0;
  // warmth: number = 1300;
  // structure: any = { lower: 33, upper: 60 };
  // text: number = 0;
  @ViewChild("map") mapElement: ElementRef;
  @ViewChild(Slides) slides: Slides;
  @ViewChildren('bgColor', {read: ElementRef}) btn : QueryList<ElementRef>;
  person;
  //  @ViewChild("filterSearch") filterSearch: ElementRef;
  sampleArr = [];
  resultArr = [];
  db = firebase.firestore().collection('Users');
  dbRequest = firebase.firestore().collection('Request');
  isSearchbarOpened = false;
  color: string = 'yakha';
  slidesPerView: number = 1;
  // changes if the content is empty
  items: any;
  info = false;
  builder = [];
  owner = [];
  colors=[{coL:"#7b557f"},{col:"#7b558G"},{col:"#23557f"},{col:"#88557f"},{col:"#7b747f"}];
  // lat: number = -26.2609906;
  // lng: number = 27.949579399999998;
  places;
  requestFound: string = '';
  map: any;
  //  marker: any;
  public lat: any;
  public lng: any;
  geoloc;
  status: string = '';
  maps: boolean = false;
  request: boolean = false;
  ownerUID: string;
  ownerName;
  ownerImage: any;
  bUID: string;
  price = 0;
  display: string = 'none';
  range: string = 'none';
  constructor(public navCtrl: NavController,
    private modalCtrl: ModalController,
    public loader: LoadingController,
    private geolocation: Geolocation,
    private menuCtrl: MenuController,
    private callNumber: CallNumber,
    public platform: Platform,
    public popoverCtrl: PopoverController,
    public elementref: ElementRef,
    public renderer: Renderer2,
    private localNotifications: LocalNotifications

  ) {
    
   
  }

  ngOnInit() {




    this.menuCtrl.swipeEnable(true);
    if (this.isSearchbarOpened) {
      this.color = 'primary';
    } else {
      this.color = 'yakha';
    }
    //console.log(this.platform.width());


    /* home page loads start here */
    /*   this.loader.create({
        content:"Loading..",
        duration: 1000
      }).present(); */
    let user = firebase.auth().currentUser;
    if (user) {
      let userLoggedIn = this.db.doc(user.uid);
      userLoggedIn.onSnapshot(getuserLoggedIn => {
        if (getuserLoggedIn.data().builder == true) {

          if (getuserLoggedIn.data().status == true) {
            this.maps = false;
            this.request = true;
          }

        }
        else {
          this.geolocation.getCurrentPosition().then((resp) => {
            let NEW_ZEALAND_BOUNDS = {
              north: -22.0913127581,
              south: -34.8191663551,
              west: 10.830120477,
              east: 32.830120477,
            };
            let coords1 = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
            //  console.log(resp.coords.latitude, resp.coords.longitude);

            let mapOptions = {
              center: coords1,
              zoom: 11,
              draggable: false,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              restriction: {
                latLngBounds: NEW_ZEALAND_BOUNDS,
                strictBounds: false,
              },
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
                  "featureType": "administrative.country",
                  "elementType": "geometry.fill",
                  "stylers": [
                    {
                      "color": "#216d7b"
                    },
                    {
                      "visibility": "on"
                    },
                    {
                      "weight": 5
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
                      "color": "#216d7b"
                    },
                    {
                      "saturation": 100
                    },
                    {
                      "visibility": "on"
                    },
                    {
                      "weight": 1
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
            }

            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

            let input = document.getElementById('search');
            let searchBox = new google.maps.places.SearchBox(input);
            this.map.addListener('bounds_changed', (res) => {
              searchBox.setBounds(this.map.getBounds());
            });
            let markers = [];
            searchBox.addListener('places_changed', (res) => {
              var places = searchBox.getPlaces();
              if (places.length == 0) {
                return;
              }
              markers.forEach((marker) => {
                marker.setMap(null);
              });
              markers = [];
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
            let marker1 = new google.maps.Marker({
              map: this.map,
              position: coords1,
              title: 'Click to view details',
            })
            let infoWindow = new google.maps.InfoWindow({
              content: 'My location'
            });
            google.maps.event.addListener(marker1, 'click', (resp) => {
              infoWindow.open(this.map, marker1)
            })

            google.maps.event.addListener(marker1, 'click', (resp) => {
              this.map.setZoom(15);
              this.map.setCenter(marker1.getPosition());
            });
            this.db.where("builder", "==", true).onSnapshot((resp) => {
              // if(this.slides.getActiveIndex()){
              resp.forEach((doc) => {
                let certified = (doc.data().certified == true) ? 'Certified' : 'Not certified';
                let lat = "<br>Builder name: " + doc.data().fullName + "<br>Price: R" + doc.data().price + '<br>' + certified;
                let coord = new google.maps.LatLng(doc.data().lat, doc.data().lng);

                let marker = new google.maps.Marker({
                  map: this.map,
                  position: coord,
                  draggable: true,
                  animation: google.maps.Animation.DROP,
                  title: 'Click to view details',
                })
                let infoWindow = new google.maps.InfoWindow({
                  content: lat
                });
                google.maps.event.addListener(marker, 'click', (resp) => {
                  //infoWindow.open(this.map, marker)
                  this.viewBuilderInfo(doc.data());
                })
                google.maps.event.addListener(marker, 'click', (resp) => {
                  this.map.setZoom(15);
                  this.map.setCenter(marker.getPosition());
                });

              })
              //     }
              // doc.data() is never undefined for query doc snapshots


            });

          }).catch((error) => {
            console.log('Error getting location', error);
          });
          // this.search(this.builder);
          this.maps = true;
          this.request = false;
          /// this.builder = [];
          this.db.where("builder", "==", true).onSnapshot(snapshot => {
            if (snapshot.size)
              snapshot.forEach(doc => {
                this.builder.push(doc.data());
                this.bUID = doc.id;
              });
            //this.builder = [];
            //console.log('Builders: ', this.builder);

          });
        }
        // else {
        //   console.log('you are in the waiting list. please wait for 24 hours');

        // }

      })
    } else {
      this.navCtrl.setRoot(WelcomePage);
    }
    /* home page loads here */
  }
  onInput(event) {
    /*    console.log(event._value);
       this.db.where('fullName','==',event._value).onSnapshot(snapshot => {
         snapshot.forEach(doc => {
         console.log(doc.data());
       });
       //console.log('Builders: ', this.builder);
   
     }); */
  }
  back() {
    this.navCtrl.setRoot(LoginPage);
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
  callJoint(phoneNumber) {
    this.callNumber.callNumber(phoneNumber, true);
  }
  // this.callNumber.callNumber("18001010101", true)
  //   .then(res => console.log('Launched dialer!', res))
  //   .catch(err => console.log('Error launching dialer', err));
  initializeItems() {

    this.items = [
      'Amsterdam',
      'Bogota',

    ];
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

  search(event) {
    let searchKey: string = event.value;
    let firstLetter = searchKey;
    this.builder = [];
    this.db.where('fullName', '==', firstLetter)
      .where('builder', '==', true)
      .onSnapshot((res) => {
        if (res.size > 0) {
          this.builder = [];
          res.forEach((doc) => {
            this.builder.push(doc.data());

          })
        } else {

          //  console.log(this.builder);
          this.builder = [];
          this.db.where("builder", "==", true).onSnapshot(snapshot => {
            snapshot.forEach(doc => {
              this.builder.push(doc.data());
              this.bUID = doc.id;
            });
            //console.log('Builders: ', this.builder);

          });
        }

      })
  }
  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.items = [];
    }
  }
  ionViewDidLoad() {
    

    if (this.platform.width() > 1200) {
      this.slidesPerView = 5;
    }

    // On a desktop, and is wider than 768px
    else if (this.platform.width() > 768) {
      this.slidesPerView = 3;
    }

    // On a desktop, and is wider than 400px
    else if (this.platform.width() > 450) {
      this.slidesPerView = 2;
    }

    // On a desktop, and is wider than 319px
    else if (this.platform.width() > 319) {
      this.slidesPerView = 1;
    }

    let data = {
      builder: {},
      owner: {}
    }

    this.dbRequest.where('builderUID', '==', firebase.auth().currentUser.uid).onSnapshot((res) => {
      this.owner = [];
      res.forEach((doc) => {
        this.localNotifications.schedule({
          text: 'You have new request',
          led: 'FF0000'
        });
        this.requestFound = '';
        //  this.ownerUID = doc.data().uid; 
       

        this.db.doc(doc.data().hOwnerUid).get().then((res) => {
          data.owner = res.data();
          data.builder = doc.data();
           console.log(res.data());
          this.owner.push(data);
          data = {
            builder: {},
            owner: {}
          }

         
        })
        console.log(this.btn.setDirty);
        
         this.btn.forEach(element => {
          let colors = ['rgba(197, 101, 66, 0.966)', '#3c7f8b', 'white', ''];
          let randomColor = Math.floor((Math.random() * colors.length));
          this.renderer.setStyle(element, 'background', colors[randomColor]);
          console.log('modany',element.nativeElement);
          
        }); 
       


         setTimeout(() => {
          // this.getOwners();
          let colors = ['rgba(197, 101, 66, 0.966)', '#3c7f8b', 'white', '']
          let cards = this.elementref.nativeElement.children[1].children[1].children[0].children.length;
          for (var i = 0; i < cards; i++) {
            console.log('for running');

            let background = i % 2;

            let cards = this.elementref.nativeElement.children[1].children[1].children[0].children[0].children[2].children[i]
            let randomColor = Math.floor((Math.random() * colors.length));
            if (background) {
              console.log(cards);

              this.renderer.setStyle(cards, 'background', colors[randomColor])
            } else {
              console.log(cards);
              this.renderer.setStyle(cards, 'background', colors[randomColor])
            }
          }
          console.log('for done');
          console.log(cards);
        }, 500) 




      })

      
    });

  }


  //viewmore
  viewBuilderInfo(builder) {


    this.navCtrl.push(BuilderProfileviewPage, builder);
  }
  viewRequest(user) {
    this.navCtrl.push(ViewmessagePage, user);
  }
  
  // viewOwner(owner) {
  //   this.navCtrl.push(HomeOwnerProfilePage, owner);
  // }
  showSearch() {

    let search = this.elementref.nativeElement.children[1].children[1].children[1].children[0].children[1];
    if (this.display == 'none') {
      this.display = 'block';
      this.renderer.setStyle(search, 'display', 'block');
    } else {
      this.display = 'none';
      this.renderer.setStyle(search, 'display', 'none');
    }


  }
 
  showRangeSearch() {

    let search = this.elementref.nativeElement.children[1].children[1].children[2];
    console.log(search);

    if (this.range == 'none') {
      this.range = 'block';
      this.renderer.setStyle(search, 'display', 'block');
    } else {
      this.range = 'none';
      this.renderer.setStyle(search, 'display', 'none');
    }


  }

  moveMapEvent() {
    let currentIndex = this.slides.getActiveIndex();
    let currentEvent = this.builder[currentIndex];
    this.map.setCenter({ lat: currentEvent.lat, lng: currentEvent.lng });
  }



}


