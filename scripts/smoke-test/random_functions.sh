#!/usr/bin/env bash

function get_random_port() {
  local port
  port=$(shuf -i 3000-9999 -n 1)
  echo "$port"
}

function used_port(){
  local port=$1
  local used
  used=$(lsof -i -P -n | grep LISTEN | awk '{print $9}' | cut -d ':' -f 2 | sort -n | grep -w "$port")
  echo "$used"
}

function get_random_port_not_used() {
  local port
  local used
  port=$(get_random_port)
  used=$(used_port "$port")
  while [[ -n $used ]]; do
    port=$(get_random_port)
    used=$(used_port "$port")
  done
  echo "$port"
}

function get_random_secret() {
  openssl rand -base64 32
}

#function main() {
#  local port
#  port=$(get_random_port_not_used)
#  echo "$port"
#}
#
#main%
