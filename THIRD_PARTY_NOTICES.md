# LYCHGATE third-party notices

LYCHGATE v5.3.0 includes a local QR encoder so Passage Stone images can be rendered without a network connection.

## QRCode for JavaScript

Copyright (c) 2009 Kazuhiko Arase.

The QRCode implementation is MIT licensed. The complete MIT notice is included at `vendor/MIT-QRCode.txt`.

## qrcode-terminal modifications

The bundled browser wrapper is derived from the QRCode vendor implementation distributed with `qrcode-terminal`. That package is distributed under Apache License 2.0. The complete Apache 2.0 text supplied with that package is included at `vendor/APACHE-2.0-qrcode-terminal.txt`.

The vendored code is stored locally, makes no network requests, and is not required for core play except when the user chooses to render a Passage Stone as a QR image.
