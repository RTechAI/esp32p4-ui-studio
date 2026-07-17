import sys
from PIL import Image

TARGET_W = 1024
TARGET_H = 600
TARGET_RATIO = TARGET_W / TARGET_H

ARTWORK_W = 320
ARTWORK_H = 220


def process_hero(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")

    width, height = image.size
    source_ratio = width / height

    if source_ratio > TARGET_RATIO:
        crop_width = round(height * TARGET_RATIO)
        left = (width - crop_width) // 2

        image = image.crop(
            (
                left,
                0,
                left + crop_width,
                height,
            )
        )

    elif source_ratio < TARGET_RATIO:
        crop_height = round(width / TARGET_RATIO)
        top = (height - crop_height) // 2

        image = image.crop(
            (
                0,
                top,
                width,
                top + crop_height,
            )
        )

    return image.resize(
        (TARGET_W, TARGET_H),
        Image.Resampling.LANCZOS,
    )


def process_artwork(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")

    image.thumbnail(
        (ARTWORK_W, ARTWORK_H),
        Image.Resampling.LANCZOS,
    )

    output = Image.new(
        "RGBA",
        (ARTWORK_W, ARTWORK_H),
        (0, 0, 0, 0),
    )

    x = (ARTWORK_W - image.width) // 2
    y = (ARTWORK_H - image.height) // 2

    output.alpha_composite(
        image,
        dest=(x, y),
    )

    return output


def main():
    if len(sys.argv) < 2:
        raise SystemExit(
            "Usage: ForgeUIImagePreprocessor.py "
            "<image_path> [asset_mode]"
        )

    image_path = sys.argv[1]

    asset_mode = (
        sys.argv[2].strip().lower()
        if len(sys.argv) > 2
        else "image"
    )

    print("################################")
    print("FORGE PREPROCESSOR IS RUNNING")
    print("MODE =", asset_mode)
    print("IMAGE =", image_path)
    print("################################")

    with Image.open(image_path) as source:
        image = source.convert("RGBA")

        if asset_mode == "hero":
            print(">>> HERO BRANCH <<<")
            image = process_hero(image)

        elif asset_mode == "artwork":
            print(">>> ARTWORK BRANCH <<<")
            image = process_artwork(image)

        elif asset_mode == "icon":
            print(">>> ICON BRANCH <<<")
            image = image.copy()

        else:
            print(">>> DEFAULT IMAGE BRANCH <<<")
            image = image.copy()

        width, height = image.size

        image.save(
            image_path,
            "PNG",
        )

    print(f"Processed asset mode: {asset_mode}")
    print(f"Processed image: {image_path}")
    print(f"Output dimensions: {width}x{height}")


if __name__ == "__main__":
    main()