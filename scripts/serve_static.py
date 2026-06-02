from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist-unified"
LOG = ROOT / "python-static-server.log"


def main() -> None:
    try:
        handler = partial(SimpleHTTPRequestHandler, directory=str(DIST))
        server = ThreadingHTTPServer(("127.0.0.1", 3000), handler)
        LOG.write_text("Serving http://127.0.0.1:3000/\n", encoding="utf-8")
        server.serve_forever()
    except Exception as error:
        LOG.write_text(f"Server failed: {error!r}\n", encoding="utf-8")
        raise


if __name__ == "__main__":
    main()
