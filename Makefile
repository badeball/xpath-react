MOCHA := ./node_modules/.bin/_mocha
ISTANBUL := ./node_modules/.bin/istanbul

all: test

ci: test-cover

lint:
	echo "Not yet implemented"
	false

test:
	$(MOCHA) --reporter dot --ui tdd --compilers js:babel/register test/**/*_test.js

test-cover:
	$(ISTANBUL) cover --report lcov $(MOCHA) -- --reporter dot --ui tdd --compilers js:babel/register test/**/*_test.js

.PHONY: lint test test-cover
