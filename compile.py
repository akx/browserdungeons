import glob, os, sys
compilerJars = (
	r"\dev\compiler.jar",
	r"c:\utils\closure-compiler.jar",
)
for compiler in compilerJars:
	if os.path.exists(compiler):
		break
else:
	print "No closure compiler found. Dying."
	sys.exit(1)
coreJs = ["tiledata.js", "underscore.js", "Base.js", "classes.js", "util.js"]
skipJs = []
finalJs = ["game.js"]
otherJs = sorted(set(f for f in glob.glob("*.js") if f[0] != "_") - set(coreJs) - set(skipJs) - set(finalJs))
allJs = coreJs + otherJs + finalJs
jsSize = sum(os.stat(f).st_size for f in allJs)
cmdLine = ["java -jar %s" % compiler]
for js in allJs:
	cmdLine.append("--js %s" % js)
cmdLine.append("--js_output_file _compiled.js")
cmdLine = " ".join(cmdLine)
os.system(cmdLine)
cSize = os.stat("_compiled.js").st_size

print "Original: %d bytes" % jsSize
print "Compiled: %d bytes" % cSize
print "   Ratio: %.1f%%" % ( cSize / float(jsSize) * 100)