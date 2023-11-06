#!/bin/bash
# set counter 'c' to 1 and condition 
# c is less than or equal to 5
for (( c=1; c<=10; c++ ))
do
 for (( p=1; p<=c; p++ ))
 do
   params+="uint256 _param$p,"
   signatureParams+="_param$p,"
   signature+="uint256,"
   body+="jacketDescriptor.method$p=_param$p;"
 done
 printf "function setMethod$c(uint256 _param1, string memory _tokenURI) public evaluatedByCreator(msg.sender,abi.encodeWithSignature(\"setMethod1(uint256, string)\", _param1, _tokenURI),address(this)) evaluatedByHolder(msg.sender,abi.encodeWithSignature(\"setMethod$c(uint256, string)\",_param1, _tokenURI),address(this)){ _setMethod$c(_param1, _tokenURI);}"
 printf "function _setMethod$c(uint256 _param1, string memory _tokenURI) public { jacketDescriptor.method1 = _param1; setTokenURI(_tokenURI);emit StateChanged(jacketDescriptor);}\n"
 printf "\n\n"
 params=""
 body=""
 signature=""
 signatureParams=""
done
