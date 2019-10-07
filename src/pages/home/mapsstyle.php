<?php
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
  ?>