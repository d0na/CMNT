#!/bin/bash
# set counter 'c' to 1 and condition 
# c is less than or equal to 5
for (( c=1; c<=10; c++ ))
do
 printf "const JacketMutableAsset$c = await ethers.getContractFactory(\"JacketMutableAsset$c\");\nconst jacketMutableAsset$c = await JacketMutableAsset$c.deploy();\n"
done


for (( c=1; c<=10; c++ ))
do
 printf "jacketMutableAsset$c,\n"
done
