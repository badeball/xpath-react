MOCHA := ./node_modules/.bin/_mocha
ESLINT := ./node_modules/.bin/eslint
ISTANBUL := ./node_modules/.bin/istanbul

all: lint test

ci: lint test-cover

clean-install:
	@rm -rf node_modules/
	@npm install
	@npm install --no-save react@16 react-dom@16 react-test-renderer@16 xpath-evaluator@3

lint:
	@$(ESLINT) .

test:
	@$(MOCHA) --reporter dot --ui tdd --compilers js:babel/register test/**/*_test.js

test-cover:
	@$(ISTANBUL) cover --report lcov $(MOCHA) -- --reporter dot --ui tdd --compilers js:babel/register test/**/*_test.js

.PHONY: clean-install lint test test-cover
