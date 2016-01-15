angular.module('upark.filter', [])

.filter('dateInMillis', function() {
  return function(input) {
    return Date.parse(input);
  };
})

/**
.filter('updateTimeInMillis', function() {
  return function(input) {
    if(input !== undefined && input !== null) {
      return Date.parse(input);
    }else {
      return '尚未開始更新';
    }
  };
})
**/

.filter('mysqlTimeFormat', function() {
  return function(mysqlTime) {
    if(mysqlTime !== undefined && mysqlTime !== null){
      var t = mysqlTime.split(/[- :]/);
      var hour = t[0];
      var min = t[1];
      if(parseInt(hour + min) > 0){
        return [hour, ' : ', min].join('');
      }else{
        return '未 設定';
      }
    }else{
      return '未 設定';
    }
  };
})

.filter('mysqlTimeFormat2', function() {
  return function(start_time, end_time) {
    if(start_time !== undefined && start_time !== null){
      var t1 = start_time.split(/[- :]/);
      var hour1 = t1[0];
      var min1 = t1[1];
    }
    if(end_time !== undefined && end_time !== null){
      var t2 = end_time.split(/[- :]/);
      var hour2 = t2[0];
      var min2 = t2[1];
    }
    if(parseInt(hour1 + min1) > 0){
      if(parseInt(hour2 + min2) > 0){
        return [hour1, ' : ', min1, ' 至 ', hour2, ' : ', min2].join('');
      }else{
        return [hour1, ' : ', min1, ' 開放'].join(''); //'結束時間尚未設定';
      }
    }else{
      if(t2 !== undefined && t2 !== null && parseInt(hour2 + min2) > 0){
        return ['直到 ', hour2, ' : ', min2, ' 結束'].join(''); //'起始時間尚未設定';
      }else{
        return '尚未設定';
      }
    }
  };
})

/**
.filter('timeFormat', function() {
  return function(input) {
    var time = new Date(input * 1000);
    if(isNaN(time)){
      return '未設定';
    }
    var hour = time.getUTCHours();
    var min = time.getUTCMinutes();
    if (hour < 10) {
      hour = '0' + hour;
    }
    if (min < 10) {
      min = '0' + min;
    }
    return hour + ' : ' + min;
  };
})

.filter('notCompleteTime', function() {
  return function(start_time, end_time) {
    if(start_time !== undefined && start_time !== null){
      if(end_time !== undefined && end_time !== null){
        //return moment().format(start_time, 'HH:mm') + " 至 " + moment().format(end_time, 'HH:mm');
        return start_time + " 至 " + end_time;
      }else{
        return '結束時間尚未設定';
      }
    }else{
      if(end_time !== undefined && end_time !== null){
        return '起始時間尚未設定';
      }else{
        return '尚未設定';
      }
    }
  };
})
**/

.filter('noValue', function() {
  return function(input) {
    if(input !== undefined && input !== null) {
      return input;
    }else {
      return '--';
    }
  };
})

.filter('noNumValue', function() {
  return function(input) {
    if(input !== undefined && input !== null) {
      if(parseInt(input) > 0){
        return input;
      }else {
        return '--';
      }
    }else {
      return '--';
    }
  };
})

.filter('distance', function () {
  return function (input) {
      if (input >= 1000) {
          return [(input/1000).toFixed(2), 'km'].join('');
      } else {
          return [Math.round(input), 'm'].join('');
      }
  };
})

.filter('money', function() {
  return function(charge_price, charge_type) {
    //console.log('charge_price: ' + charge_price + ', charge_type: ' + charge_type);
    switch(charge_type){ // 收費方式,0:未設定,1:每小時扣點
      case '0':
        return '尚未設定';
        break;
      case '1':
        if(charge_price <= 0){
          return '免費!!';
        }else{
          return [charge_price, ' 點 / 小時'].join('');
        }
        break;
      default:
        return '未知';
    }
  };
})

.filter('uparkStatus', function() { // 狀態,0:空位,1:預約保留中,4:未開放
  return function(status) {
    switch(status){
      case '0':
        return '開放中';
        break;
      case '1':
        return '預約保留中';
        break;
      case '4':
        return '未開放';
        break;
      default:
        return '未知';
    }
  };
})

.filter('iconPath', function(FileUtil) {
  return function(seqNo) {
    if(seqNo){
      return FileUtil.getIconPath(seqNo);
    }else{
      return 'img/ionic.png';
    }
  };
})

.filter('photoPath', function(FileUtil) {
  return function(seqNo) {
    if(seqNo){
      return FileUtil.getPhotoPath(seqNo);
    }else{
      return 'img/ionic.png';
    }
  };
})
