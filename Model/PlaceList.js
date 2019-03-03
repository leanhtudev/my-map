class PlaceList {
  constructor() {
    this.List = [];
  }
  addPlace(place) {
    this.List = [...this.List, place];
  }
  deletePlace(lat, lng) {
    console.log("a");
    let index = this.findIndex(lat, lng);
    if (index >= 0) {
      this.List.splice(index, 1);
    }
  }
  updatePlace(newPlace) {
    let index = this.findIndex(newPlace.Lat, newPlace.Lng);
    if (index >= 0) {
      this.List[index] = { ...newPlace };
    }
  }
  updateKeyword(lat, lng, keyword) {
    let index = this.findIndex(lat, lng);
    if (index >= 0) {
      this.List[index].Keyword = keyword;
      console.log("done");
    }
  }
  findIndex(lat, lng) {
    for (let i in this.List) {
      if (this.List[i].Lat == lat && this.List[i].Lng == lng) {
        return i;
      }
    }
    return -1;
  }
  searchTitle(keyword) {
    let result = [];
    for (let place of this.List) {
      if (place.Title.toLowerCase().indexOf(keyword.toLowerCase()) >= 0) {
        result.push(place);
      }
    }
    return result;
  }
  searchKeyword(keyword) {
    let result = [];
    for (let place of this.List) {
      for (let key of place.Keyword) {
        if (key.toLowerCase().indexOf(keyword.toLowerCase()) >= 0) {
          result.push(place);
        }
      }
    }
    return result;
  }
}
