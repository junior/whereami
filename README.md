# Where am I? — MultiCloud demo

A small React app that, on startup, looks up the **server's own** IP details and shows which
cloud or network it is running in — with the matching provider logo over an animated cloud
backdrop. Deploy the same image to AWS, Azure, OCI, a Raspberry Pi, or your laptop and it
tells you where it landed.

![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)
![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite 6](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![CI](https://github.com/junior/whereami/actions/workflows/ci.yml/badge.svg)

![WhereAmI screenshot](docs/screenshot.png)

## How it works

At container start, [`entrypoint.sh`](entrypoint.sh) fetches the server's public IP details
from [ipinfo.io](https://ipinfo.io) into a static `ipinfo.json`. The React app reads that file
and maps the network's AS number to a provider logo (Oracle, AWS, Azure, Akamai, Cloudflare,
…). An invalid token falls back to the free (unauthenticated) lookup; if that also fails
(offline), the app shows a clear error rather than misleading data.

## Quickstart (Docker)

```bash
docker run --rm -it -p 8000:8080 ghcr.io/junior/whereami
# → open http://localhost:8000
```

With your own ipinfo.io token (higher rate limits):

```bash
docker run --rm -it -p 8000:8080 -e IPINFO_TOKEN=<your-ipinfo-token> ghcr.io/junior/whereami
```

## Development

```bash
npm install
npm run dev        # Vite dev server → http://localhost:3000
```

`npm run build` emits static files to `dist/`; `npm run lint` runs ESLint; `npm test` runs
the Vitest unit tests. In dev the app serves the bundled `public/ipinfo.json` sample, so the
card is populated without a token.

## Kubernetes

Quick run:

```bash
kubectl run whereami --image=ghcr.io/junior/whereami --port=8080
kubectl port-forward pod/whereami 8000:8080      # → http://localhost:8000
```

Persistent — the manifests in [`k8s/`](k8s/) run as a non-root user with a read-only root
filesystem, drop all Linux capabilities, and add readiness/liveness probes:

```bash
kubectl apply -f https://raw.githubusercontent.com/junior/whereami/main/k8s/deployment.yaml
kubectl apply -f https://raw.githubusercontent.com/junior/whereami/main/k8s/service.yaml
kubectl apply -f https://raw.githubusercontent.com/junior/whereami/main/k8s/ingress.yaml
```

To pass an ipinfo.io token, create a Secret (the Deployment reads it, `optional: true`):

```bash
kubectl create secret generic whereami --from-literal=ipinfo-token=<your-ipinfo-token>
```

## Configuration

| Variable | Default | Purpose |
|----------|---------|---------|
| `IPINFO_TOKEN` | _(empty)_ | ipinfo.io API token for higher rate limits. Empty **or invalid** falls back to the free (unauthenticated) lookup. |
| `WHEREAMI_CA_CERT` | _(empty)_ | path to a mounted CA cert to trust for the ipinfo call — for corporate TLS-intercepting (MITM) proxies. `CURL_CA_BUNDLE` works too. |
| `HTTPS_PROXY` · `NO_PROXY` | _(empty)_ | standard proxy env, honored by the ipinfo lookup. |

The container listens on **8080** as a non-root user. The token is used server-side at
startup only — it is never sent to the browser.

## Behind a corporate proxy / MITM (optional)

If outbound HTTPS is intercepted by a corporate proxy that re-signs TLS, the ipinfo.io call
fails certificate verification until the container trusts your corporate root CA. Mount it and
point `WHEREAMI_CA_CERT` (or the standard `CURL_CA_BUNDLE`) at it — the lookup uses `curl`, so
`HTTPS_PROXY` / `NO_PROXY` are honored automatically too.

**Docker:**

```bash
docker run --rm -it -p 8000:8080 \
  -v /path/to/corp-ca.crt:/etc/whereami-ca/ca.crt:ro \
  -e WHEREAMI_CA_CERT=/etc/whereami-ca/ca.crt \
  ghcr.io/junior/whereami
```

**Kubernetes** — put the CA in a ConfigMap, mount it read-only, and set the env:

```bash
kubectl create configmap whereami-ca --from-file=ca.crt=/path/to/corp-ca.crt
```

```yaml
    spec:
      containers:
        - name: whereami
          env:
            - name: WHEREAMI_CA_CERT
              value: /etc/whereami-ca/ca.crt
          volumeMounts:
            - name: corp-ca
              mountPath: /etc/whereami-ca
              readOnly: true
      volumes:
        - name: corp-ca
          configMap: { name: whereami-ca }
```

## Build the image

```bash
# single platform
docker build -t whereami .
docker run --rm -it -p 8000:8080 whereami

# multi-platform → registry
docker buildx build --push --platform linux/amd64,linux/arm64 \
  -t your-registry/whereami:latest .
```

## Releasing

Images are published to **GitHub Packages (GHCR)** by
[`.github/workflows/release.yml`](.github/workflows/release.yml) — multi-platform
(`linux/amd64`, `linux/arm64`), tagged `latest` plus the semver version:

```bash
git tag v1.0.0 && git push origin v1.0.0   # → ghcr.io/junior/whereami:1.0.0 + :latest
```

Or run it manually (Actions → **Publish image** → Run workflow) to refresh `:latest`. The
first publish creates the package; make it public in the repo's **Packages** settings for
anonymous `docker pull`.

## Tech

React 19 · Vite 6 · non-root nginx · Docker · Kubernetes

## License

[MIT](LICENSE) — built by [Adao Oliveira Jr](https://adao.dev).
