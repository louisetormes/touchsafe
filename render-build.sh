#!/bin/bash

set -euo pipefail

exec 2> >(grep -v 'tput: command not found' >&2)

export TERM=dumb
export NO_COLOR=1
unset COLORTERM

echo "Iniciando build customizado..."
if [ -f "build.sh" ]; then
    chmod +x build.sh
    ./build.sh
else
    echo "Erro: build.sh não encontrado!"
    exit 1
fi

echo "Build concluído com sucesso!"