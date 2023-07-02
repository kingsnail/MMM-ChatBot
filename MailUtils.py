# Import smtplib for the actual sending function
import smtplib

# Import the email modules we'll need
from email.mime.text import MIMEText

class Mail:
    def __init__(self, config):
        self.__config = config
    def send_email(m_to, m_subject, m_body):

       print("body:")
       print(m_body)
    
       # Create a text/plain message
       msg = MIMEText(m_body)

       msg['Subject'] = m_subject
       msg['From'] = m_from
       msg['To'] = m_to

       # Send the message via our own SMTP server, but don't include the
       # envelope header.
       s = smtplib.SMTP('smtp.gmail.com', 587)
       s.starttls()
       s.login(self.__config["gmail"]["from"], self.__config["gmail"]["password"]) #login with mail_id and password
       s.sendmail(self.__config["gmail"]["from"], [m_to], msg.as_string())
       s.quit()
