#!/bin/sh
DIR=deploy

# pull latest JS from GIT
# git pull origin tmdev

#delete temp directory
#rm -rf $DIR

# create temp directory
#mkdir $DIR

# create package.xml
#ant -f buildHtml.xml setup

# pull down visualforce pages
#ant -f buildHtml.xml retrieve


replace(){
	# Test to make sure the HTML file exists if not, exit script
	if [ ! -f "itlApp/_public/${1}" ]
	then
		echo "itlApp/_public/${1} not found"
		exit
	fi

	# Test to make sure the Visualforce Page exists if not, exit script
	if [ ! -f "$DIR/pages/${2}" ]
	then
		echo "$DIR/pages/${2} not found"
		exit
	fi

	# retrieve HTML from and including header and footer
	sed -n '/<!-- COPY TO REMOTE -->/,/<!-- \/COPY TO REMOTE -->/p' itlApp/_public/${1} > $DIR/new.html

	# Strip everything between the <!-- HTML Markup --> and <!-- END HTML Markup --> comments
	awk '/<!-- REPLACE FROM LOCAL -->/{p=1;print} /<!-- \/REPLACE FROM LOCAL -->/{p=0}!p' $DIR/pages/${2} > $DIR/stripped.page

	# merge new HTML with new stripped VF page
	sed '/<!-- REPLACE FROM LOCAL -->/ r '$DIR'/new.html' $DIR/stripped.page > $DIR/pages/${2}

}

# here you need to change
#replace SRTemplateManager.html SRTemplateManager.page

# **** Make sure if you are adding a visualforce page to add it to the buildHtml.xml package also ****

rm $DIR/new.html
rm $DIR/stripped.page

#ant -f buildHtml.xml deploy

## copy new pages to the force/src/pages directory
#cp -rf $DIR/pages/ ../../force.com/src/pages/
#cp $DIR/staticresources/SGI_Backbone.resource ../../force.com/src/staticresources

## manually do a git commit

echo "Don't forget to commit the new VF pages and JS!!!"
