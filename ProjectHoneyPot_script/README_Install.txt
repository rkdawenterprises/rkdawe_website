PROJECT HONEY POT ADDRESS DISTRIBUTION SCRIPT

Congratulations! You've successfully begun the process of installing a
Project Honey Pot address distribution script on your website. Through
this script we hand out honey pot addresses and track the spammers who
abuse them.

The next step is to install this script on your web server. The
following instructions are provided to help you with this process. They
have been written to apply to many cases, but not all. If you have
questions, or these instructions do not seem to apply in your case, you
should check with your website administrator.

-------------------------
INSTALLATION INSTRUCTIONS
-------------------------

STEP 1: LOCATE THE SCRIPT

	Locate the copy of the script included in the downloaded file. In
	your case, the script is named:

	departuregradual.py

STEP 2: COPY IT TO THE CORRECT LOCATION

	Copy the script into your web server's CGI folder. On most
	Unix/Linux systems this folder will be called:

	cgi-bin/ or cgi/

	If you do not know where your CGI folder is located, ask your
	web server administrator. Ensure when you copy the script you do
	not change its name or otherwise modify it.

		You may install the script in any folder that is accessible
		over the web. For example:

		cgi-bin/folder1/folder2/

STEP 3: SET THE PERMISSIONS

	On most systems, in order for the script to execute its
	permissions must be set correctly. On Unix/Linux systems you
	can set the scripts' permissions with the following command:

        chmod 644 departuregradual.py

STEP 4: INSTALL PYTHON

	The script requires your webserver to have a working installation of
	the Python programming language. If it has not already
	been installed you will need to install it.

	You may download the latest version of Python from following website:

        http://www.python.org/


Installation instructions can be found here:

		http://www.python.org/download/


STEP 5: VISIT THE SCRIPT

	Once you've installed the script on your web server you need to
	access it. Open a web browser and type in the URL of your web site
	followed by the path to the script. For example, if you installed
	your script inside 'folder1/folder2/', access the script like so:

        http://rkdawenterprises.ddns.net/folder1/folder2/departuregradual.py

	If installed correctly, you will see instructions on how to
	finalize the installation.

---------------
TROUBLESHOOTING
---------------

PYTHON INSTALLATION

	In order for the script to work, you must install Python. If you
	have not already installed Python, you can get the latest version
	and instructions on how to install it, from:

        http://www.python.org/


Python works well with the Apache Web Server:

		http://www.apache.org/


KNOWN GOOD CONFIGURATIONS

	The Python script has been tested with Python 2.1, 2.2, 2.3 and 2.4
	on Debian Linux and Python 2.3 and Python 2.4 on Microsoft Windows.

WEB SERVER CONFIGURATION

	You need to make certain your web server software is able to
	execute CGI scripts. Follow the instructions provided with your
	web server software in order to ensure it is set up correctly
	to do this.
        
INTERPRETER LOCATION

	It is possible if the script isn't working that the location of
	the Python interpreter is set incorrectly. The script sets the
	default location of your Python interpreter as:
	
	/usr/bin/python
	
	If your Python interpreter is located somewhere else you'll need
	to modify the first line of the script. In Linux/Unix you can
	determine the location of your Python interpreter by typing the
	following into the command line:
	
	which python
	
	If the results are anything other than /usr/bin/python you should
	open the script file with a text editor. You should change the
	first line of the script to the Python interpreter's path,
	preceded by a number sign and an exclamation point. For
	example:
	
	#!/other/path/to/python
	
	In Windows you should try the following path:
	
	#!C:\python\bin\python.exe 
	
	Please note that you may modify the first line of the Python
	version of the Project Honey Pot Address Distribution Script
	without violating the Terms of Service Use. However, you may not
	make changes beyond that without disconnecting the script from
	Project Honey Pot's servers.


SCRIPT CHANGES

	You can only change the first line of the script (the #! "hash-bang"
	line which specifies the path of the interpreter to use). The script
	will not execute correctly if you change anything else. You should
	return to the Project Honey Pot site and download a new copy of the
	script if you modified it in any way.

---------------------------
DEINSTALLATION INSTRUCTIONS
---------------------------

To deinstall the script, simply delete it. If possible, please login 
to your Project Honey Pot account and use the web interface to let us
know you have deleted the honey pot.