import glob, os
coreJs = ["underscore.js", "cobra.js", "classes.js", "util.js"]
skipJs = ["tiledata.js"]
otherJs = sorted(set(f for f in glob.glob("*.js") if f[0] != "_") - set(coreJs) - set(skipJs))
allJs = coreJs + otherJs

cmdLine = ["java -jar \\dev\\compiler.jar"]
for js in allJs:
	cmdLine.append("--js %s" % js)
cmdLine.append("--js_output_file _compiled.js")
cmdLine = " ".join(cmdLine)
print cmdLine
os.system(cmdLine)