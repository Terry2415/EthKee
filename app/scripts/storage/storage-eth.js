const StorageBase = require('./storage-base');
const Alerts = require('../comp/alerts');
const pako = require('pako');

window.App = {
  web3Provider: null,
  contracts: {},
  contractAddress: '0x0',
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("../app/scripts/storage/UserProfileContract.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.UserProfileContract = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.UserProfileContract.setProvider(App.web3Provider);
    });
  }
};

App.init();

const StorageEthereum = StorageBase.extend({
    name: 'ethereum',
    enabled: true,
    uipos: 40,
    iconSvg: '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="256px" height="256px" viewBox="0 0 2560 2560" preserveAspectRatio="xMidYMid meet">'+
    '<g id="layer103" fill="#a5adbc" stroke="none">'+
    '<path d="M1200 2400 c-391 -30 -743 -267 -920 -620 -46 -91 -89 -220 -103 -307 -6 -40 -14 -73 -17 -73 -3 0 -4 -53 -2 -117 3 -65 5 -135 6 -155 0 -21 5 -38 9 -38 5 0 7 -9 4 -20 -3 -11 -1 -23 4 -26 6 -3 8 -11 6 -17 -2 -7'+
    ' 2 -27 10 -45 7 -18 11 -37 8 -42 -4 -6 -2 -10 3 -10 6 0 13 -12 17 -27 17 -69 125 -263 189 -341 19 -22 130 -128 166 -159 106 -88 277 -173 435 -214 79 -21 112 -24 270 -24 165 0 189 3 280 28 394 107 703 416 805 804 31 120'+
    ' 48 394 27 453 -3 8 -15 52 -26 97 -33 132 -88 256 -161 363 -51 74 -195 233 -220 242 -12 4 -19 12 -15 17 6 10 -40 46 -59 46 -6 0 -12 5 -14 10 -4 14 -74 55 -84 49 -10 -6 -48 14 -71 38 -11 11 -26 17 -37 13 -11 -3 -22 0'+
    ' -27 8 -10 18 -75 39 -95 32 -9 -4 -19 -1 -23 4 -3 6 -10 9 -15 6 -5 -3 -21 2 -35 11 -17 11 -37 15 -60 11 -19 -3 -37 -1 -40 4 -7 10 -72 10 -215 -1z m272 -35 c165 -28 326 -97 459 -196 82 -60 212 -195 262 -272 396 -599'+
    ' 128 -1397 -550 -1640 -210 -76 -493 -77 -709 -3 -349 119 -615 404 -711 764 -24 87 -27 115 -27 272 0 157 3 185 27 272 111 415 449 727 871 803 98 18 276 18 378 0z"></path>'+
    '<path d="M1247 2143 c-114 -158 -518 -736 -515 -738 2 -2 127 70 278 160 246 146 277 162 295 151 98 -63 535 -324 535 -320 0 7 -551 794 -555 794 -2 0 -19 -21 -38 -47z"></path>'+
    '<path d="M1000 1445 c-160 -98 -265 -169 -264 -178 1 -12 486 -837 529 -900 11 -16 47 38 294 449 155 257 278 471 274 475 -17 17 -545 319 -556 318 -7 0 -131 -74 -277 -164z"></path>'+
    '</g>'+'<g id="layer104" fill="#dbdbdf" stroke="none">'+
    '<path d="M1180 2394 c-276 -33 -481 -128 -672 -312 -122 -117 -235 -290 -278 -427 -7 -22 -15 -44 -19 -50 -3 -5 -6 -14 -8 -20 -1 -5 -5 -21 -8 -35 -13 -55 -26 -143 -30 -205 -1 -27 -3 -54 -5 -60 -1 -5 -1 -12 0 -15 7 -16 6 -62'+
    ' -2 -66 -5 -3 -4 -12 2 -20 7 -7 10 -31 7 -53 -2 -22 0 -42 4 -43 5 -2 11 -21 14 -43 11 -94 87 -272 165 -383 27 -41 50 -76 50 -79 0 -2 43 -47 96 -99 155 -153 315 -243 524 -295 82 -20 119 -23 270 -23 181 0 200 3 360 54 89 28'+
    ' 239 110 319 174 207 165 336 362 402 611 23 87 40 307 27 365 -4 21 -3 39 4 47 8 10 7 18 -4 31 -9 9 -16 24 -16 32 -7 94 -97 316 -175 429 -40 59 -166 205 -181 210 -22 7 -55 44 -49 54 3 6 1 7 -6 3 -15 -10 -43 13 -34 27 3 6 1'+
    ' 7 -5 3 -15 -9 -64 23 -55 37 3 5 1 7 -4 4 -6 -4 -57 15 -114 43 -57 27 -144 59 -194 71 -49 12 -97 24 -105 26 -8 3 -29 5 -46 4 -18 -1 -35 2 -39 8 -8 14 -49 13 -195 -5z m295 -26 c162 -27 356 -115 491 -222 183 -145 316 -346'+
    ' 380 -577 35 -126 44 -343 20 -470 -45 -240 -152 -437 -327 -605 -426 -407 -1101 -403 -1521 9 -378 369 -441 941 -153 1384 238 365 675 555 1110 481z"></path>'+
    '<path d="M1014 1808 c-148 -209 -270 -385 -272 -389 -2 -5 118 64 267 151 148 88 274 160 280 160 12 0 489 -286 514 -308 9 -8 19 -13 21 -11 3 3 -522 760 -538 776 -1 2 -124 -169 -272 -379z"></path>'+
    '<path d="M1005 1444 c-148 -91 -271 -167 -273 -168 -3 -4 524 -885 537 -899 8 -8 111 157 444 705 l126 206 -278 161 c-153 89 -280 161 -282 161 -2 0 -125 -75 -274 -166z"></path>'+
    '</g>'+'</svg>',

    _baseUrl: 'https://graph.microsoft.com/v1.0/me',

    getPathForName: function(fileName) {
      return fileName + '.kdbx';
    },

    _isValidKey: function() {
      console.log("hello storage contract");
      return this.is_curr_contract_address_valide();
    },

    is_curr_contract_address_valide: function(){
      if(typeof App.contracts.UserProfileContract !== 'undefined'){
        try {
            App.contracts.UserProfileContract.at(App.contractAddress);
        }
        catch (e) {
            return false;
        }
        return true;
      }
      else {
        App.init();
      }
    },

    needShowOpenConfig: function() {
        return !this._isValidKey();
    },

    getOpenConfig: function() {
        return {
            desc: 'contractSetupDesc',
            fields: [
                {id: 'address', title: 'contractAddress', desc: 'contractAddress', type: 'text', placeholder: 'contractAddress',curr_address: App.contractAddress}
            ]
        };
    },

    address_getall_by_account: function(){

    },

    applyConfig: function(config, callback) {
      //检验用户输入合约是否有效，若有效，设置其为当前合约地址
        if(typeof App.contracts.UserProfileContract !== 'undefined'){
          try {
            App.contracts.UserProfileContract.at(config.address).then(function(instance) {
              if(instance){
                App.contractAddress = config.address;
                Alerts.alert({
                  header: "设置当前合约地址成功:</br>"+App.contractAddress,
                  buttons: [Alerts.buttons.ok],
                  success: () => {return callback && callback();}
                });
              }
            });
          }
          catch (e) {
            return callback && callback("该合约地址不存在");
          }
        }
        else {
          App.init();
        }
    },

    createConfig: function(config, callback){
        if(callback){
          callback();
        }
      //创建合约实例
        if(typeof App.contracts.UserProfileContract !== 'undefined'){
            App.contracts.UserProfileContract.new({from: web3.eth.defaultAccount}).then(function(instance){
              if(instance){
                Alerts.alert({
                  header: "创建合约地址成功:</br>"+instance.address,
                  buttons: [Alerts.buttons.ok],
                });
                return;
              }
              else {
                Alerts.alert({
                  header: "创建合约地址失败",
                  buttons: [Alerts.buttons.ok],
                });
                return;
              }
            });
        }
        else {
          App.init();
        }
    },

    load: function(path, opts, callback) {
      if(typeof App.contracts.UserProfileContract !== 'undefined'){
        App.contracts.UserProfileContract.at(App.contractAddress).then(function(instance) {
          return instance.getInfo.call(path);
        }).then(function(result) {
            var uintArray = [],
                xxx = "";
            for(var i=2; i<result.length-1; i=i+2){
                xxx = "0x"+result.slice(i,i+2);
                uintArray.push(eval(xxx));
            }
            var receive_data = new Uint8Array(uintArray).buffer;
            return callback && callback(null, receive_data);
        });
      }
      else {
        App.init();
      }
    },

    stat: function(path, opts, callback) {
      return callback && callback({ notFound: true });
    },

    save: function(path, opts, data, callback, rev) {
      console.log('storage-eth:save()');
      console.log(path+'的 byteLength 为'+data.byteLength);

      var send_string = String.fromCharCode.apply(null, new Uint8Array(data));

      if(callback){
        callback();
      }

      if(typeof App.contracts.UserProfileContract !== 'undefined'){
          App.contracts.UserProfileContract.at(App.contractAddress).then(function(instance) {
            return instance.setInfo(path,send_string, { from: web3.eth.defaultAccount});
          }).then(function(result){
            if(result){
              Alerts.alert({
                header: path+"已保存至合约地址:</br>"+App.contractAddress,
                buttons: [Alerts.buttons.ok],
              });
              return;
            }
            else {
              Alerts.alert({
                header: "保存失败",
                buttons: [Alerts.buttons.ok],
              });
              return;
            }
          });
      }
      else {
        App.init();
      }
    },

    list: function(dir, callback) {
      if(typeof App.contracts.UserProfileContract !== 'undefined'){
        App.contracts.UserProfileContract.at(App.contractAddress).then(function(instance) {
          return instance.getKeys.call();
        }).then(function(result) {
              if (!result) {
                console.log("contract is empty");
                const fileList = []
                    .filter(f => f.name)
                    .map(f => ({
                        name: f.name,
                        path: f.name,
                        rev: "f.eTag",
                        dir: false
                    }));
                return callback && callback(null, fileList);
                  //this.logger.error('List error', this.logger.ts(ts), result);
              }
              console.log("contract Listed");
              var result_list = result.substring(1).split(",");
              var result_transfor = new Array(result_list.length);
              for (var i = 0; i<result.length; i++){
                result_transfor.push({"name":result_list[i]});
              }
              const fileList = result_transfor
                  .filter(f => f.name)
                  .map(f => ({
                      name: f.name,
                      path: f.name,
                      rev: "f.eTag",
                      dir: false
                  }));
              return callback && callback(null, fileList);
          });
      }
      else {
        App.init();
      }
    },

    remove: function(path, callback) {
      return callback && callback();
    },

    mkdir: function(path, callback) {

    },

    setEnabled: function(enabled) {

    },

    _getClientId: function() {

    },

    _getOAuthConfig: function() {

    },

    _popupOpened(popupWindow) {

    }
});

module.exports = new StorageEthereum();
