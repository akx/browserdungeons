import glob, os
coreJs = ["underscore.js", "Base.js", "classes.js", "util.js"]
skipJs = ["tiledata.js"]
finalJs = ["game.js"]
otherJs = sorted(set(f for f in glob.glob("*.js") if f[0] != "_") - set(coreJs) - set(skipJs) - set(finalJs))
allJs = coreJs + otherJs + finalJs

cmdLine = ["java -jar \\dev\\compiler.jar"]
for js in allJs:
	cmdLine.append("--js %s" % js)
cmdLine.append("--js_output_file _compiled.js")
cmdLine = " ".join(cmdLine)
print cmdLine
os.system(cmdLine)