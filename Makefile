MOCHA := ./node_modules/.bin/_mocha
ESLINT := ./node_modules/.bin/eslint
ISTANBUL := ./node_modules/.bin/istanbul

all: lint test

ci: lint test-cover

REACT_VERSION=16

clean-install:
	rm -rf node_modules/
	npm install
	npm install --no-save react@${REACT_VERSION} react-dom@${REACT_VERSION} react-test-renderer@${REACT_VERSION} xpath-evaluator@3

lint:
	$(ESLINT) .

test:
	$(MOCHA) --reporter dot --ui tdd --compilers js:babel/register test/**/*_test.js

test-cover:
	$(ISTANBUL) cover --report lcov $(MOCHA) -- --reporter dot --ui tdd --compilers js:babel/register test/**/*_test.js

.PHONY: clean-install lint test test-cover
