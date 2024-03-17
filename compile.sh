#!/bin/bash

js2ds $1 && ds-as $1.asm && cat $1.asm.txt && echo ""
