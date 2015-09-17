MOCHA := ./node_modules/.bin/mocha
ESLINT := ./node_modules/.bin/eslint

all: lint test

lint:
	@$(ESLINT) .

test:
	@$(MOCHA) --recursive --reporter dot --ui tdd --compilers js:babel/register

.PHONY: lint test
