#!/bin/bash

# ==========================================
# SAWK - Inline AWK Syntax Highlighting Demo
# ==========================================

echo "1. Simple one-liner"
# The code inside simple quotes should be highlighted as AWK
awk 'BEGIN { print "Hello, World!" }'

echo "2. Using flags"
# Highlighting should work even with flags like -F
echo "root:x:0:0" | awk -F: '{ print "User: " $1, "ID: " $3 }'

echo "3. Multi-line script"
# Complex script spanning multiple lines
awk '
    BEGIN {
        sum = 0
        print "Starting calculation..."
    }
    {
        if ($1 > 10) {
            sum += $1
            print "Added " $1
        }
    }
    END {
        print "Total: " sum
    }
' data.txt

echo "4. Inside a pipe chain"
# Nested in a pipeline
ls -l | awk '$5 > 1000 { print $9 " is large" }' | sort

echo "5. With variables passed from Bash"
# Note: Syntax highlighting usually stops at the closing quote
threshold=500
awk -v limit="$threshold" '
    $1 > limit {
        print $0 " exceeds limit"
    }
' input.log
