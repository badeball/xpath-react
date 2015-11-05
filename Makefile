MOCHA := ./node_modules/.bin/_mocha
ESLINT := ./node_modules/.bin/eslint
ISTANBUL := ./node_modules/.bin/istanbul

all: lint test

ci: lint test-cover

lint:
	@$(ESLINT) .

test:
	@$(MOCHA) --reporter dot --ui tdd --compilers js:babel/register test/**/*_test.js

test-cover:
	@$(ISTANBUL) cover --report lcov $(MOCHA) -- --recursive --reporter dot --ui tdd --compilers js:babel/register

.PHONY: lint test test-cover
