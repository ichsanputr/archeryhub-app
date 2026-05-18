import os
from PIL import Image

def make_transparent(image_path, output_path):
    print(f"processing {image_path}...")
    img = Image.open(image_path)
    img = img.convert("RGBA")
    
    datas = img.getdata()
    new_data = []
    
    for item in datas:
        # if pixel is white or near-white (threshold 235 to catch off-white edges)
        if item[0] > 235 and item[1] > 235 and item[2] > 235:
            # make it fully transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"saved transparent image to {output_path}")

if __name__ == "__main__":
    targets = [
        r"c:\E\ichsan\startup\archeryhub.id\app\public\badminton_vector.png",
        r"c:\E\ichsan\startup\archeryhub.id\app\public\badminton_vector_2.png"
    ]
    for target in targets:
        if os.path.exists(target):
            make_transparent(target, target)
        else:
            print(f"file not found: {target}")
