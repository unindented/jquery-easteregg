# Setup ######################################################################

# Directories

SRC_DIR     := $(CURDIR)
BUILD_DIR   := $(CURDIR)
DOC_DIR     := $(CURDIR)/docs
TEST_DIR    := $(CURDIR)/test
NPM_DIR     := $(CURDIR)/node_modules
NPMBIN_DIR  := $(NPM_DIR)/.bin

# Main stuff

SRC_FILE    := $(SRC_DIR)/jquery.easteregg.js
BUILD_FILE  := $(BUILD_DIR)/jquery.easteregg.min.js

# Test stuff

TEST_FILE   := $(TEST_DIR)/run.js
TEST_URL    := file:///$(TEST_DIR)/index.html

# Misc stuff

README_FILE := $(CURDIR)/README.md

# Commands ###################################################################

DOCCO   := $(shell which $(NPMBIN_DIR)/docco)
JSHINT  := $(shell which $(NPMBIN_DIR)/jshint)
UGLIFY  := $(shell which $(NPMBIN_DIR)/uglifyjs)
NPM     := $(shell which npm)
RUBY    := $(shell which ruby)
WATCH   := $(shell which watch)
PHANTOM := $(shell which phantomjs)

# Newline used in messages
define \n


endef

# Documenting with Docco (http://jashkenas.github.com/docco/)
define doc-cmd
$(if $(DOCCO),,$(error \
$(\n)You must have *docco* installed to build the documentation for this project. \
$(\n)Please run *make dependencies*))

@@mkdir -p $(DOC_DIR)
@@touch $(DOC_DIR)
@@$(DOCCO) $(SRC_FILE)
endef

# Linting with JSHint (http://www.jshint.com/)
define lint-cmd
$(if $(JSHINT),,$(error \
$(\n)You must have *jshint* in your path to lint the files in this project. \
$(\n)Please run *make dependencies*))

@@$(JSHINT) $(SRC_FILE)
endef

# Testing with PhantomJS (http://www.phantomjs.org/)
define test-cmd
$(if $(PHANTOM),,$(error \
$(\n)You must have *phantomjs* in your path to run the tests in this project. \
$(\n)Please go to http://www.phantomjs.org/ for instructions))

@@$(PHANTOM) $(TEST_FILE) $(TEST_URL)
endef

# Building with UglifyJS (https://github.com/mishoo/UglifyJS/)
define build-cmd
$(if $(UGLIFY),,$(error \
$(\n)You must have *uglifyjs* in your path to build the files in this project. \
$(\n)Please run *make dependencies*))

@@$(UGLIFY) --mangle --compress --comments='/^!/' --output $(BUILD_FILE) $(SRC_FILE)
endef

# Watching with Watch (https://github.com/visionmedia/watch/)
define watch-cmd
$(if $(WATCH),,$(error \
$(\n)You must have *watch* in your path to watch the files in this project. \
$(\n)Please go to https://github.com/visionmedia/watch/ for instructions))

@@$(WATCH) -q $(MAKE)
endef

# Serving with WEBrick (http://www.ruby-doc.org/stdlib/libdoc/webrick/rdoc/)
define serve-cmd
$(if $(RUBY),,$(error \
$(\n)You must have *ruby* in your path to serve the files in this project. \
$(\n)Please go to http://www.ruby-lang.org/ for instructions))

@@$(RUBY) -r webrick -e " \
	s = WEBrick::HTTPServer.new(:Port => 3000, :DocumentRoot => Dir.pwd); \
	Signal.trap('INT') { s.shutdown }; \
	s.start; \
"
endef

# Installation of dependencies with npm (http://npmjs.org/)
define dependencies-cmd
$(if $(NPM),,$(error \
$(\n)You must have *npm* in your path to install the dependencies for this project. \
$(\n)Please go to http://npmjs.org/ for instructions))

@@$(NPM) install
endef

# Rules ######################################################################

.SUFFIXES:

all: lint test build

# Build the documentation
doc: $(SRC_FILE)
	$(info Building project documentation...)
	$(doc-cmd)

# Lint the files
lint: $(SRC_FILE)
	$(info Linting project files...)
	$(lint-cmd)

# Run the tests
test: $(SRC_FILE)
	$(info Running project tests...)
	$(test-cmd)

# Build the minified file
build: $(BUILD_FILE)
$(BUILD_FILE): $(SRC_FILE)
	$(info Building project files...)
	$(build-cmd)

# Watch the files
watch:
	$(info Watching project files...)
	$(watch-cmd)

# Serve the files
serve:
	$(info Serving project files...)
	$(serve-cmd)

# Install the dependencies
dependencies:
	$(info Installing project dependencies...)
	$(dependencies-cmd)

# Clean (almost) everything
clean: clean-doc clean-build

clean-doc:
	@@rm -rf $(DOC_DIR)

clean-build:
	@@rm -rf $(BUILD_FILE)

clean-npm:
	@@rm -rf $(NPM_DIR)

.PHONY: lint test watch serve dependencies clean clean-doc clean-build clean-npm
