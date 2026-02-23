import os

def remove_comments_from_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    new_lines = []
    in_block_comment = False
    modified = False
    
    for line in lines:
        original = line
        
        if in_block_comment:
            if '*/' in line:
                in_block_comment = False
                line = line.split('*/', 1)[1]
            else:
                continue
                
        while '/*' in line and not in_block_comment:
            if '*/' in line:
                before = line.split('/*', 1)[0]
                after = line.split('*/', 1)[1]
                line = before + after
            else:
                line = line.split('/*', 1)[0] + '\n'
                in_block_comment = True
                
        if not in_block_comment:
            stripped = line.lstrip()
            # If the entire line is a line comment
            if stripped.startswith('//'):
                modified = True
                continue
                
            # Inline comment starting with ' // ' to avoid picking up http:// URLs
            if ' // ' in line:
                line = line.split(' // ', 1)[0] + '\n'
                
        if line != original:
            modified = True
            
        new_lines.append(line)
        
    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
            
for root, dirs, files in os.walk('.'):
    if 'node_modules' in root or '.git' in root or 'dist' in root:
        continue
    for f in files:
        if f.endswith(('.go', '.ts', '.tsx')):
            remove_comments_from_file(os.path.join(root, f))
