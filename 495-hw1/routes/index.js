var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  request({
      url: 'https://api.ibb.gov.tr/ispark/Park',
      method: 'GET'
    }, function (error, response, body) {
      if (error) {
        console.log('Error message: ', error);
      } else if (response.body.error) {
        console.log('Response Error: ', response.body.error);
      }
      let data = JSON.parse(body);
      let list=[];
      for(let i=0; i < data.length; i++ ){
        if (list.includes(data[i]['Ilce']) === false) {
          list.push(data[i]['Ilce']);
        }
      }
      res.render('begin', {list: list});
  });
});

router.post('/', function(req, res, next) {
  res.render('begin');
});

router.get('/park', function(req, res, next) {
  res.redirect('/');
});

router.post('/park', function(req, res, next) {
  selected_ilce = req.body.ilce;

  request({
    url: 'https://api.ibb.gov.tr/ispark/Park',
    method: 'GET'
  }, function (error, response, body) {
    if (error) {
      console.log('Error message: ', error);
    } else if (response.body.error) {
      console.log('Response Error: ', response.body.error);
    }
    let data = JSON.parse(body);
    let list=[];
    let a = 0;
    for(let i=0; i < data.length; i++ ){
      let ilce = data[i]['Ilce'];
      if (ilce === selected_ilce) {
        list.push(data[i]['ParkAdi']);
        a++;
      }
    }
    res.render('park', {ilce: selected_ilce, list: list});
  });
});

router.get('/map', function(req, res, next) {
  res.render('map');
});

router.post('/map', function(req, res, next) {
  let list=[];
  let selected_park = req.body.selectpicker;

  request({
    url: 'https://api.ibb.gov.tr/ispark/Park',
    method: 'GET'
  }, function (error, response, body) {
    if (error) {
      console.log('Error message: ', error);
    } else if (response.body.error) {
      console.log('Response Error: ', response.body.error);
    }
    let data = JSON.parse(body);

    let a = 0;
    for(let i=0; i < data.length; i++ ){
      let park = data[i]['ParkAdi'];
      if (park === selected_park) {
        list.push(data[i]);
        a++;
      }
    }
    res.render('map', {parkadi: list[0]['ParkAdi'], ilce: list[0]['Ilce'], cap: list[0]['Kapasitesi'], empty: list[0]['BosKapasite'], lon:list[0]['Longitude'], lat:list[0]['Latitude']});

  });
});


module.exports = router;