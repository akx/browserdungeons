import glob, os, sys

compilerJars = ("./tools/closure-compiler-v20200614.jar",)
for compiler in compilerJars:
    if os.path.exists(compiler):
        break
else:
    print("No closure compiler found. Dying.")
    sys.exit(1)
coreJs = ["tiledata.js", "underscore.js", "Base.js", "classes.js", "util.js"]
skipJs = []
finalJs = ["game.js"]
baseJs = {f for f in glob.glob("*.js") if f[0] != "_"}
otherJs = sorted(baseJs - set(coreJs) - set(skipJs) - set(finalJs))
allJs = coreJs + otherJs + finalJs
jsSize = sum(os.stat(f).st_size for f in allJs)
cmdLine = [f"java -jar {compiler}"]
for js in allJs:
    cmdLine.append(f"--js {js}")
cmdLine.append("--js_output_file compiled.js")
cmdLine = " ".join(cmdLine)
os.system(cmdLine)
cSize = os.stat("compiled.js").st_size

ratio = cSize / float(jsSize) * 100
print(f"Original: {jsSize} bytes")
print(f"Compiled: {cSize} bytes")
print(f"   Ratio: {ratio:.1f}%")
