// personal data-sharing platform Source code

pragma solidity ^0.4.19;

/**
 * @title UserProfileContract
 * @dev The UserProfileContract will include the personal information.
 */
contract UserProfileContract{
    //public datatype
    address public owner;//record the owner of the contract
    string[100] public keys;//record the keys of recordMapping
    uint8 public infoCount;//record the number of file stored

    //mapping
   mapping (string => bytes) InfoMapping;//store the personal data
    /**
      * @dev Throws if caldled by any account other than the owner.
    */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    //concat the keys
    function strConcat(string _a, string _b) internal returns (string){
	    bytes memory _ba = bytes(_a);
	    bytes memory _bb = bytes(_b);
	    string memory ab = new string(_ba.length + _bb.length);
	    bytes memory bab = bytes(ab);
	    uint k = 0;
	    for (uint i = 0; i < _ba.length; i++) bab[k++] = _ba[i];
	    for (i = 0; i < _bb.length; i++) bab[k++] = _bb[i];
	    return string(bab);
    }

    //is the string equal
    function stringsEqual(string storage  _a, string memory  _b) internal returns (bool) {
		bytes storage  a = bytes(_a);
		bytes memory b = bytes(_b);
		if (a.length != b.length)
			return false;
		// @todo unroll this loop
		for (uint i = 0; i < a.length; i ++)
			if (a[i] != b[i])
				return false;
		return true;
	  }

    //is the key existed
    function isExisted(string _key) internal returns (bool){
        string storage key;
        for(uint i=0;i<infoCount;i++){
            key=keys[i];
	         if(stringsEqual(key,_key)) return true;
	     }
	     return false;
    }

    //constructior function
    function UserProfileContract(){
        owner=msg.sender;
        infoCount=0;
    }

	//return all of the keys of record mapping
    function getKeys() public constant returns (string) {
        string memory results;
        string key;
        for(uint i = 0; i < infoCount; i++){
            key=keys[i];
            results = strConcat(strConcat(results,","),key);
        }
        return results;
    }

    //write the personal data
    function setInfo(string _key, bytes _value){
  	    bool existed;
  	    existed=isExisted(_key);
  	    if(!existed){
              keys[infoCount]=_key;
              infoCount=infoCount+1;
  	     }
  	    InfoMapping[_key]=_value;
  	}

  	//get the data stored in record mapping
    function getInfo(string _key) public constant returns(bytes _value){
        _value=InfoMapping[_key];
    }
}
