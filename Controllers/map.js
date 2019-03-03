let map;
let placeList = new PlaceList();
let newPos;

let title = getEle("txtTitle");
let description = getEle("txtDescription");
let open = getEle("txtOpen");
let close = getEle("txtClose");
let lat = getEle("txtLat");
let lng = getEle("txtLng");
let keyword = getEle("txtKeyword");

let title_info = getEle("txtShowTitle");
let description_info = getEle("txtShowDescription");
let open_info = getEle("txtShowOpen");
let close_info = getEle("txtShowClose");
let lat_info = getEle("txtShowLat");
let lng_info = getEle("txtShowLng");
let keyword_info = getEle("txtShowKeyword");

let myForm = getEle("myForm");
let myPlaceInfo = getEle("placeInfo");
let btnSubmit = getEle("btnSubmitForm");
let btnEdit = getEle("btnEditForm");
let btnCancel = getEle("btnCancelForm");
let searchKeyword = getEle("search");
let filterSelect = getEle("filterSelect");
let markers = [];
let status = 1; // 1 for adding, 2 for editing
function initMap() {
  //create map and marker of where you are
  let x = navigator.geolocation;
  myInfoWindow = new google.maps.InfoWindow();
  if (x) {
    x.getCurrentPosition(
      function(position) {
        let coords = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        map = new google.maps.Map(document.getElementById("map"), {
          zoom: 14,
          center: coords
        });

        myInfoWindow.setPosition(coords);
        myInfoWindow.setContent("You are here!");
        myInfoWindow.open(map);

        // click event for map
        map.addListener("click", function(e) {
          status = 1;
          newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
          lat.value = newPos.lat;
          lat.readOnly = true;
          lng.value = newPos.lng;
          lng.readOnly = true;
          // display info form
          myForm.style.display = "block";
          myPlaceInfo.style.display = "none";
        });
      },
      function() {}
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

function createMarker(list) {
  // let marker = new google.maps.Marker({ map: map, position: pos });
  // return placeList.map((place, index) => {

  // });
  for (let place of list) {
    let pos = { lat: place.Lat, lng: place.Lng };
    let marker = new google.maps.Marker({
      map: map,
      position: pos,
      title: place.name
    });
    markers.push(marker);
    marker.addListener("click", () => {
      myForm.style.display = "none";
      displayInfo(place);
    });
  }
  console.log(markers);
}
function getEle(id) {
  return document.getElementById(id);
}

// Clicking Event for Submit btn in Info Form
getEle("btnSubmitForm").addEventListener("click", () => {
  let newPlace = new Place(
    title.value,
    description.value,
    parseFloat(open.value),
    parseFloat(close.value),
    parseFloat(lat.value),
    parseFloat(lng.value),
    keywordToArr(keyword.value)
  );

  if (status == 1) {
    placeList.addPlace(newPlace);
  } else {
    placeList.updatePlace(newPlace);
    displayInfo(newPlace);
  }
  console.log(placeList.List);
  console.log(newPlace);
  createMarker(placeList.List);
  getEle("formControl").reset();
  myForm.style.display = "none";
});
// Clicking Event for Cancel btn in Info Form
getEle("btnCancelForm").addEventListener("click", () => {
  myForm.style.display = "none";
});

function displayInfo(place) {
  myPlaceInfo.innerHTML = ` 
  
  <div class="form-group">
    <label for="">Title</label>
    <p>${place.Title}</p>
  </div>
  <div class="form-group">
    <label for="">Description</label>
    <p>${place.Description}</p>
  </div>
  <div class="form-group">
    <label for="">Open Hour</label>
    <p>${place.OpenHour}</p>
  </div>
  <div class="form-group">
    <label for="">Close Hour</label>
    <p>${place.CloseHour}</p>
  </div>
  <div class="form-group">
    <label for="">Latitude</label>
    <p>${place.Lat}</p>
  </div>
  <div class="form-group">
    <label for="">Longtitude</label>
    <p>${place.Lng}</p>
  </div>
  <div class="form-group">
    <label for="">Key word</label>
    <p>${place.Keyword}</p>
  </div>
 
  <div class="form-group">
    <button class="btnDeletePlace" onClick="delPlace(${place.Lat},${
    place.Lng
  })">Delete</button>
    <button class="btnEditPlace" onClick="editPlace(${place.Lat},${
    place.Lng
  })">Edit</button>
    <button class="btnDeletePlace" onClick="editKeyword(${place.Lat},${
    place.Lng
  })">Edit keyword</button>
  </div>`;
  myPlaceInfo.style.display = "block";
}
function delPlace(lat, lng) {
  placeList.deletePlace(lat, lng);
  console.log(placeList.List);
  deleteMarkers();
  createMarker(placeList.List);
  myPlaceInfo.style.display = "none";
}
function editPlace(latPlace, lngPlace) {
  status = 2;
  lat.value = latPlace;
  lng.value = lngPlace;
  myForm.style.display = "block";
}
function deleteMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}
function keywordToArr(str) {
  var arr = [];
  arr = str.split(" ");
  return arr;
}
function searchFilter() {}

searchKeyword.addEventListener("keyup", function() {
  console.log("anc");
  let result = [];
  let keyword = searchKeyword.value;
  if (filterSelect.value == 1) {
    result = placeList.searchTitle(keyword);
    deleteMarkers();
    createMarker(result);
  } else if (filterSelect.value == 2) {
    result = placeList.searchKeyword(keyword);
    deleteMarkers();
    createMarker(result);
  }
});
function editKeyword(lat, lng) {
  console.log(lat, lng);
  myPlaceInfo.innerHTML += `
  <div class="form-group">
    <label for="">Update your keyword</label>
    <input type="text" class="form-control"  id="txtSubmitNewKeyword"/>
  </div>
  <div class="form-group">
  <button class="submitNewKeyword" onclick="submitNewKeyword(${lat},${lng})">Submit</button>
</div>
  `;
}
function submitNewKeyword(lat, lng) {
  let newKey = document.getElementById("txtSubmitNewKeyword").value;
  console.log(newKey);
  console.log(lat, lng);
  newKeyArr = keywordToArr(newKey);
  placeList.updateKeyword(lat, lng, newKeyArr);
  console.log(placeList.List);
}
