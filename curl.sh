#!/bin/bash
test_time=$1
elapsed_time=0
while [ $elapsed_time -lt $test_time ]; do
	#curl 127.0.0.1:3000
	curl  "127.0.0.1:8082"
	sleep 1
	elapsed_time=$(($elapsed_time+1))
done