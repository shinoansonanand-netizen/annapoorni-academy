import os
import uuid
from werkzeug.utils import secure_filename
from flask import current_app
from extensions import db
from models.media import Media

def save_media_file(file_storage, category='general', alt_text=None):
    """
    Validate, sanitize, save file to uploads directory and log entry in database.
    """
    if not file_storage or file_storage.filename == '':
        raise ValueError('No file selected')

    filename = secure_filename(file_storage.filename)
    ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    
    allowed_extensions = current_app.config.get('ALLOWED_EXTENSIONS', {'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'})
    if ext not in allowed_extensions:
        raise ValueError(f'File type .{ext} is not allowed')

    # Generate unique filename to avoid collision
    unique_filename = f"{uuid.uuid4().hex}_{filename}"
    upload_folder = current_app.config['UPLOAD_FOLDER']
    os.makedirs(upload_folder, exist_ok=True)
    
    file_path = os.path.join(upload_folder, unique_filename)
    file_storage.save(file_path)

    file_size = os.path.getsize(file_path)
    mime_type = file_storage.content_type or f"image/{ext}"
    file_url = f"/uploads/{unique_filename}"

    media = Media(
        filename=unique_filename,
        original_name=filename,
        file_path=file_path,
        file_url=file_url,
        mime_type=mime_type,
        file_size=file_size,
        alt_text=alt_text or filename,
        category=category
    )
    
    db.session.add(media)
    db.session.commit()

    return media.to_dict()
