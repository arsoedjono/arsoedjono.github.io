CATEGORY := $(word 2,$(MAKECMDGOALS))

sts2-sprite-generate:
	node sprite-generator/generate-sprite.js "lib/sts2/img/$(CATEGORY)/*.png" "sts2/$(CATEGORY)"

sts2-download:
	./lib/sts2/download.sh lib/sts2/files/$(CATEGORY).txt lib/sts2/img/$(CATEGORY)

# Prevent make from treating the extra argument as a target
%:
	@:
