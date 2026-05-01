FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["ShoPIM/ShoPIM.csproj", "ShoPIM/"]
RUN dotnet restore "ShoPIM/ShoPIM.csproj"

COPY . .
WORKDIR "/src/ShoPIM"
RUN dotnet publish "ShoPIM.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ShoPIM.dll"]
