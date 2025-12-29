#!/usr/bin/awk -f

# This is a sample AWK script to test the SAWK extension

BEGIN {
    FS = ","
    print "Processing file..."
    count = 0
}

# Print lines where the second field is "ERROR"
$2 == "ERROR" {
    print "Error found on line " NR ": " $0
    count++
}

# Standard pattern action
length($0) > 80 {
    print "Long line detected: " $0
}

END {
    print "Total errors: " count
    print "Done."
}


# UNCOMMENT THE LINE BELOW TO TEST DIAGNOSTICS (SYNTAX ERROR)
if () { print "Syntax error" }


function test() {
    print "Test function called"
}
if (index($0, "ERROR") > 0) {
    print "Error found on line " NR ": " $0
    count++
}
