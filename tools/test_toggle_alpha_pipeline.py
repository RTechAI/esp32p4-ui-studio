import tempfile
import unittest
from pathlib import Path
import sys

from PIL import Image

sys.path.insert(0, str(Path(__file__).parent))

from ForgeUIImagePreprocessor import process_interactive_button


class ToggleAlphaPipelineTest(unittest.TestCase):
    def test_interactive_png_preserves_alpha_and_uses_argb8888(self):
        source = Image.new("RGBA", (8, 8), (0, 0, 0, 0))

        for y in range(2, 6):
            for x in range(2, 6):
                source.putpixel((x, y), (240, 128, 32, 255))

        processed = process_interactive_button(source, 16, 16)

        with tempfile.TemporaryDirectory() as directory:
            output_path = Path(directory) / "toggle.png"
            processed.save(output_path, "PNG")

            with Image.open(output_path) as output:
                self.assertEqual(output.format, "PNG")
                self.assertEqual(output.mode, "RGBA")
                self.assertEqual(output.getpixel((0, 0))[3], 0)
                self.assertGreater(output.getpixel((8, 8))[3], 0)
                self.assertEqual(
                    output.getchannel("A").getextrema(),
                    (0, 255),
                )

        server_source = (
            Path(__file__).parents[1]
            / "studio"
            / "export-server.js"
        ).read_text(encoding="utf-8")

        self.assertRegex(
            server_source,
            r"'--cf',\s*'ARGB8888'",
        )


if __name__ == "__main__":
    unittest.main()
