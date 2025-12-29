#!/bin/bash

# This script tests inline AWK highlighting

echo "Running AWK..."

# The content inside '...' should differ in color if injection works
awk 'BEGIN { print "Hello from inline AWK" }'

# Multi-line AWK
awk '
    $1 == "root" {
        print "Found root user"
        print "Root user found on line " NR ": " $0
    }
' /etc/passwd
