import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

def _parse_smtp_config():
    """Extract and validate SMTP settings from environment variables."""
    raw_server = os.environ.get('MAIL_SERVER', 'smtp.gmail.com').strip()
    if '@' in raw_server:
        smtp_server = 'smtp.gmail.com'
    elif ':' in raw_server:
        smtp_server = raw_server.split(':')[0]
    else:
        smtp_server = raw_server or 'smtp.gmail.com'

    try:
        smtp_port = int(os.environ.get('MAIL_PORT', 587))
    except (ValueError, TypeError):
        smtp_port = 587

    smtp_user = os.environ.get('MAIL_USERNAME', '').strip()
    smtp_pass = os.environ.get('MAIL_PASSWORD', '').strip()

    return smtp_server, smtp_port, smtp_user, smtp_pass

def send_admin_email_notification(subject, body_html, recipient=None):
    """
    Sends email notification to admin recipient (shinoanson84@gmail.com).
    Uses SMTP credentials from environment variables if set, otherwise logs email payload cleanly.
    """
    admin_recipient = recipient or os.environ.get('ADMIN_EMAIL', 'shinoanson84@gmail.com')
    smtp_server, smtp_port, smtp_user, smtp_pass = _parse_smtp_config()

    print(f"\n=======================================================")
    print(f"[EMAIL NOTIFICATION TRIGGERED] -> {admin_recipient}")
    print(f"Subject: {subject}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"=======================================================\n")

    # If SMTP credentials are configured, send real email over SMTP
    if smtp_user and smtp_pass:
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"Annapoorni Academy Notifications <{smtp_user}>"
            msg['To'] = admin_recipient

            html_part = MIMEText(body_html, 'html')
            msg.attach(html_part)

            server = smtplib.SMTP(smtp_server, smtp_port, timeout=10)
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, admin_recipient, msg.as_string())
            server.quit()
            print(f"[OK] Real Email sent successfully over SMTP to {admin_recipient}!")
            return True, "Email sent successfully over SMTP."
        except Exception as e:
            print(f"[WARNING] SMTP Delivery Notice: {str(e)}")
            return False, f"SMTP Error: {str(e)}"
    else:
        print("[INFO] Note: SMTP credentials (MAIL_USERNAME/MAIL_PASSWORD) not set in .env. Notification logged & saved to Admin Portal.")
        return True, "Notification recorded in Admin Portal & logged."

def send_student_confirmation_email(recipient_email, student_name, subject, body_html):
    """
    Sends a confirmation copy of the inquiry/enrollment response directly to the student/user's email address.
    """
    smtp_server, smtp_port, smtp_user, smtp_pass = _parse_smtp_config()

    print(f"\n=======================================================")
    print(f"[STUDENT COPY EMAIL TRIGGERED] -> {recipient_email} ({student_name})")
    print(f"Subject: {subject}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"=======================================================\n")

    if smtp_user and smtp_pass:
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"Coach Sindhu Ram | Annapoorni Academy <{smtp_user}>"
            msg['To'] = recipient_email

            html_part = MIMEText(body_html, 'html')
            msg.attach(html_part)

            server = smtplib.SMTP(smtp_server, smtp_port, timeout=10)
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, recipient_email, msg.as_string())
            server.quit()
            print(f"[OK] Confirmation copy sent successfully over SMTP to student ({recipient_email})!")
            return True, "Student copy sent."
        except Exception as e:
            print(f"[WARNING] Student SMTP Delivery Notice: {str(e)}")
            return False, f"SMTP Error: {str(e)}"
    else:
        print(f"[INFO] Note: Student copy recorded for {recipient_email}. (SMTP credentials not set in .env).")
        return True, "Student copy recorded."
