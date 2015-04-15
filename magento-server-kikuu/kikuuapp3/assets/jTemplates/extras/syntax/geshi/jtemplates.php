<?php
/*************************************************************************************
 * jtemplates.php
 * --------------
 * Author: Tomasz Gloc (jtemplates@tpython.com)
 * Copyright: (c) 2009-2011 Tomasz Gloc (http://jtemplates.tpython.com)
 * Release Version: 1.1
 * CVS Revision Version: $Revision: 995 $
 * Date Started: 2007/07/13
 * Last Modified: $Date: 2007-07-02 00:21:31 +1200 (Mon, 02 Jul 2007) $
 *
 * jTemplates language file for GeSHi.	
 *
 * CHANGES
 * -------
 * 2011-11-20 (1.1)
 *   - Update to current jTemplates version
 *   
 * 2009-02-02 (1.0.2)
 *   - Add some new reserved keywords
 *
 * 2008-05-18 (1.0.1)
 *   -  Add tag '#for'
 *
 * 2007-07-13 (1.0.0)
 *   -  First Release
 *
 * TODO (updated 2007-07-13)
 * -------------------------
 *
 *************************************************************************************
 *
 *     This file is part of GeSHi.
 *
 *   GeSHi is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation; either version 2 of the License, or
 *   (at your option) any later version.
 *
 *   GeSHi is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with GeSHi; if not, write to the Free Software
 *   Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 *
 ************************************************************************************/

$language_data = array (
	'LANG_NAME' => 'jTemplates',
	'COMMENT_SINGLE' => array(),
	'COMMENT_MULTI' => array('<!--' => '-->', '{*' => '*}'),
	'CASE_KEYWORDS' => GESHI_CAPS_NO_CHANGE,
	'QUOTEMARKS' => array(),
	'ESCAPE_CHAR' => '',
	'KEYWORDS' => array(
		1 => array(
			'#template', '#foreach', '#for', '#if', '#else', '#elseif', '#include', '#param', '#var', '#cycle', '#ldelim', '#rdelim', '#literal', 'as', '#continue', '#break'
			),
		2 => array(
			'#/template', '#/for', '#/foreach', '#/if', '#/literal'
		),
		3 => array(
			'$T', '$P', '$Q', '$index', '$iteration', '$first', '$last', '$total', '$key', '$typeof'
			)
		),
	'SYMBOLS' => array(
		),
	'CASE_SENSITIVE' => array(
		GESHI_COMMENTS => false,
		1 => false,
		2 => false,
		3 => false
		),
	'STYLES' => array(
		'KEYWORDS' => array(
			1 => 'color: #0600FF;',
			2 => 'color: #0600FF;',
			3 => 'color: #22AABB;'
			),
		'COMMENTS' => array(
			'MULTI' => 'color: #808080; font-style: italic;'
			),
		'ESCAPE_CHAR' => array(
			0 => 'color: #000099; font-weight: bold;'
			),
		'BRACKETS' => array(
			0 => 'color: #66cc66;'
			),
		'STRINGS' => array(
			0 => 'color: #ff0000;'
			),
		'NUMBERS' => array(
			0 => 'color: #cc66cc;'
			),
		'METHODS' => array(
			),
		'SYMBOLS' => array(
			0 => 'color: #66cc66;'
			),
		'SCRIPT' => array(
			0 => 'color: #00bbdd;',
			1 => 'color: #ddbb00;',
			2 => 'color: #339933;',
			3 => 'color: #000000;',
			4 => 'color: #008844;',
			5 => '',
			),
		'REGEXPS' => array(
			0 => 'color: #000066;',
			1 => 'font-weight: bold; color: black;',
			2 => 'font-weight: bold; color: black;',
			)
		),
	'URLS' => array(
		),
	'OOLANG' => false,
	'OBJECT_SPLITTERS' => array(
		),
	'REGEXPS' => array(
		0 => array(
			GESHI_SEARCH => '(((xml:)?[a-z\-]+))(=)',
			GESHI_REPLACE => '\\1',
			GESHI_MODIFIERS => 'i',
			GESHI_BEFORE => '',
			GESHI_AFTER => '\\4'
			),
		1 => array(
			GESHI_SEARCH => '(&lt;[/?|(\?xml)]?[a-z0-9_\-]*(\??&gt;)?)',
			GESHI_REPLACE => '\\1',
			GESHI_MODIFIERS => 'i',
			GESHI_BEFORE => '',
			GESHI_AFTER => ''
			),
		2 => array(
			GESHI_SEARCH => '(([/|\?])?&gt;)',
			GESHI_REPLACE => '\\1',
			GESHI_MODIFIERS => 'i',
			GESHI_BEFORE => '',
			GESHI_AFTER => ''
			)
		),
	'STRICT_MODE_APPLIES' => GESHI_ALWAYS,
	'SCRIPT_DELIMITERS' => array(
		0 => array(
			'<!DOCTYPE' => '>'
			),
		1 => array(
			'&' => ';'
			),
		2 => array(
			'<![CDATA[' => ']]>'
			),
		3 => array(
			'<' => '>'
			),
		4 => array(
			'{' => '}'
			),
		5 => array(
			'{*' => '*}'
			)
	),
	'HIGHLIGHT_STRICT_BLOCK' => array(
		0 => false,
		1 => false,
		2 => false,
		3 => true,
		4 => true,
		5 => true
		)
);

?>
