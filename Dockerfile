FROM denoland/deno

# The port that your application listens to.
EXPOSE 8080

# Prefer not to run as root.
USER deno

# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache server.ts

CMD ["run", "--allow-net", "server.ts"]