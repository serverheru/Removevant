#!/usr/bin/env python3
"""
Removevant — Background Removal Engine
Uses rembg with BiRefNet model for HD quality background removal.
"""

import argparse
import sys
import os
import json
import time

def main():
    parser = argparse.ArgumentParser(description='Remove background from image using rembg + BiRefNet')
    parser.add_argument('--input', '-i', required=True, help='Path to input image')
    parser.add_argument('--output', '-o', required=True, help='Path to output PNG')
    parser.add_argument('--model', '-m', default='birefnet-general', 
                        help='Model name (default: birefnet-general)')
    parser.add_argument('--alpha-matting', '-a', action='store_true', default=False,
                        help='Enable alpha matting for better edge detail')
    
    args = parser.parse_args()

    # Validate input file
    if not os.path.isfile(args.input):
        print(json.dumps({
            "success": False,
            "error": f"Input file not found: {args.input}"
        }))
        sys.exit(1)

    try:
        start_time = time.time()

        # Import rembg and PIL
        from rembg import remove, new_session
        from PIL import Image

        # Initialize session with BiRefNet model
        session = new_session(args.model)

        # Open input image
        input_image = Image.open(args.input)
        original_size = input_image.size

        # Remove background
        if args.alpha_matting:
            output_image = remove(
                input_image,
                session=session,
                alpha_matting=True,
                alpha_matting_foreground_threshold=240,
                alpha_matting_background_threshold=10,
                alpha_matting_erode_size=10
            )
        else:
            output_image = remove(input_image, session=session)

        # Ensure output directory exists
        output_dir = os.path.dirname(args.output)
        if output_dir and not os.path.exists(output_dir):
            os.makedirs(output_dir, exist_ok=True)

        # Save as PNG (to preserve transparency)
        output_image.save(args.output, format='PNG', optimize=True)

        elapsed = round(time.time() - start_time, 2)
        result_size = os.path.getsize(args.output)

        print(json.dumps({
            "success": True,
            "input_size": list(original_size),
            "output_file": args.output,
            "output_size_bytes": result_size,
            "processing_time": elapsed,
            "model": args.model,
            "alpha_matting": args.alpha_matting
        }))

    except ImportError as e:
        print(json.dumps({
            "success": False,
            "error": f"Missing dependency: {str(e)}. Run: pip install rembg[cpu] Pillow"
        }))
        sys.exit(1)

    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e)
        }))
        sys.exit(1)


if __name__ == '__main__':
    main()
