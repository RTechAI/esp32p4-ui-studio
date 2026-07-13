import sys
from PIL import Image

TARGET_W = 1024
TARGET_H = 600
TARGET_RATIO = TARGET_W / TARGET_H


def main():
    if len(sys.argv) < 2:
        raise SystemExit("Usage: ForgeUIImagePreprocessor.py <image_path>")

    image_path = sys.argv[1]

    with Image.open(image_path) as image:
        image = image.convert("RGBA")

        width, height = image.size
        source_ratio = width / height

        if source_ratio > TARGET_RATIO:
            crop_width = round(height * TARGET_RATIO)
            left = (width - crop_width) // 2
            image = image.crop((left, 0, left + crop_width, height))
        elif source_ratio < TARGET_RATIO:
            crop_height = round(width / TARGET_RATIO)
            top = (height - crop_height) // 2
            image = image.crop((0, top, width, top + crop_height))

        image = image.resize(
            (TARGET_W, TARGET_H),
            Image.Resampling.LANCZOS,
        )

        image.save(image_path, "PNG")

    print(f"Processed image: {image_path}")
    print(f"Output dimensions: {TARGET_W}x{TARGET_H}")


if __name__ == "__main__":
    main()