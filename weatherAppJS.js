var apikey = 'RbeNONzecOM7YAbdZ1YYQC0xKEVVuVhI';

var weatherInfoObj = {};
//logic to read coordinates
window.addEventListener('load',()=>{
//alert("loded....!")
let lat, long;
var country, 
locationKey,
timezone,
locationName;


navigator.geolocation.getCurrentPosition((position)=>{
    //console.log(position);
    lat = position['coords']['latitude'];
    long = position['coords']['longitude'];
    console.log(lat+" "+long);
    
    var geopositionURL = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apikey}&q=${lat},${long}`;
    axios.get(geopositionURL).then((res)=>{
         console.log(res);
         country = res.data.Country.EnglishName;
         locationKey = res.data.Key;
         timezone = res.data.TimeZone;
         locationName = res.data.LocalizedName;
        //  console.log('country:',country);
         // console.log('location key',locationKey);
        //  console.log('timezone',timezone);
        //  console.log('location Name',locationName);
        weatherInfoObj['country'] = res.data.Country.EnglishName;
        weatherInfoObj['locationKey'] = res.data.Key;
        weatherInfoObj['timezone'] = res.data.TimeZone;
        weatherInfoObj['CurrentLocation'] = res.data.LocalizedName;

            getWeatherdata(apikey,locationKey);
    })
})
});

function getWeatherdata(apikey,locationKey){
    
    var weatherURL=`http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${apikey}`;
    console.log(weatherURL);
    axios.get(weatherURL).then((response)=>{
        console.log(response);
      weatherInfoObj['today'] = response.data.DailyForecasts[0].Date
      weatherInfoObj['day'] = response.data.DailyForecasts[0].Day;
      weatherInfoObj['night'] = response.data.DailyForecasts[0].Night;
      weatherInfoObj['temperature'] = response.data.DailyForecasts[0].Temperature;
      var today = new Date(weatherInfoObj['today']);
      //var morningIconUrl = "https://developer.accuweather.com/sites/default/files/01-s.png";
      //var nightIconUrl ="";
      
      
      console.log('weatherinfo:',weatherInfoObj);

      returnId('country').textContent = weatherInfoObj['country'];
      returnId('currentLocation').textContent = weatherInfoObj['CurrentLocation'];
      returnId('date').textContent = today.getDate()+'-'+(today.getMonth() + 1)+'-'+today.getFullYear()+" "+weatherInfoObj.timezone.Code;
    if(weatherInfoObj.day.Icon < 10){
        returnId('morning').setAttribute('src',`https://developer.accuweather.com/sites/default/files/0${weatherInfoObj.day.Icon}-s.png`);
    }else{
        returnId('morning').setAttribute('src',`https://developer.accuweather.com/sites/default/files/${weatherInfoObj.day.Icon}-s.png`);
    }

    if(weatherInfoObj.night.Icon < 10){
        returnId('night').setAttribute('src',`https://developer.accuweather.com/sites/default/files/0${weatherInfoObj.night.Icon}-s.png`);
    }else{
        returnId('night').setAttribute('src',`https://developer.accuweather.com/sites/default/files/${weatherInfoObj.night.Icon}-s.png`);
    }

    returnId('morning-desc').textContent = weatherInfoObj.day.IconPhrase;
    returnId('night-desc').textContent = weatherInfoObj.night.IconPhrase;
    })
    
   
}

function returnId(id){
    return document.getElementById(id);
}